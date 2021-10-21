import { CliArguments, Context } from "unimported";
import simpleGit from "simple-git";
import * as path from "path";
import { processResults } from "unimported/dist/process.js";
import {
  traverse,
  getResultObject,
  TraverseConfig,
} from "unimported/dist/traverse.js";
import {
  getCacheIdentity,
  InvalidCacheError,
  purgeCache,
} from "unimported/dist/cache.js";
import * as fs from "unimported/dist/fs.js";
import { getConfig, __clearCachedConfig } from "unimported/dist/config.js";
import * as meta from "unimported/dist/meta.js";

export default async function unimported(
  cwd: string,
  args: Partial<CliArguments> = {}
) {
  cwd = path.resolve(cwd);
  const pkgPath = path.join(cwd, "package.json");
  const hasPkg = await fs.exists(pkgPath);
  if (!hasPkg) {
    throw new Error(`No package.json found in ${cwd}`);
  }
  // FIXME:
  process.chdir(path.dirname(pkgPath));
  __clearCachedConfig();
  const config = await getConfig(args as any);
  const [dependencies, peerDependencies] = await Promise.all([
    meta.getDependencies(cwd),
    meta.getPeerDependencies(cwd),
  ]);
  const moduleDirectory = config.moduleDirectory ?? ["node_modules"];
  const context: Context = {
    dependencies,
    peerDependencies,
    config,
    moduleDirectory,
    ...args,
    cwd,
  };

  if (args.ignoreUntracked) {
    const git = simpleGit({ baseDir: context.cwd });
    const status = await git.status();
    config.ignorePatterns.push(
      ...status.not_added.map((file) => path.resolve(file))
    );
  }

  const traverseResult = getResultObject();

  for (const entry of config.entryFiles) {
    const traverseConfig: TraverseConfig = {
      extensions: entry.extensions,
      // resolve full path of aliases
      aliases: await meta.getAliases(entry),
      cacheId: args.cache ? getCacheIdentity(entry) : undefined,
      flow: config.flow,
      moduleDirectory,
      preset: config.preset,
      dependencies,
    };

    // we can't use the third argument here, to keep feeding to traverseResult
    // as that would break the import alias overrides. A client-entry file
    // can resolve `create-api` as `create-api-client.js` while server-entry
    // would resolve `create-api` to `create-api-server`. Sharing the subresult
    // between the initial and retry attempt, would make it fail cache recovery
    const subResult = await traverse(
      path.resolve(entry.file),
      traverseConfig
    ).catch((err) => {
      if (err instanceof InvalidCacheError) {
        purgeCache();
        // Retry once after invalid cache case.
        return traverse(path.resolve(entry.file), traverseConfig);
      } else {
        throw err;
      }
    });

    subResult.files = new Map([...subResult.files].sort());

    // and that's why we need to merge manually
    subResult.modules.forEach((module) => {
      traverseResult.modules.add(module);
    });
    subResult.unresolved.forEach((unresolved) => {
      traverseResult.unresolved.add(unresolved);
    });

    for (const [key, stat] of subResult.files) {
      const prev = traverseResult.files.get(key);

      if (!prev) {
        traverseResult.files.set(key, stat);
        continue;
      }

      const added = new Set(prev.imports.map((x) => x.path));

      for (const file of stat.imports) {
        if (!added.has(file.path)) {
          prev.imports.push(file);
          added.add(file.path);
        }
      }
    }
  }

  const baseUrl = (await fs.exists("src", cwd)) ? path.join(cwd, "src") : cwd;
  const files = await fs.list("**/*", baseUrl, {
    extensions: config.extensions,
    ignore: config.ignorePatterns,
  });

  const normalizedFiles = files.map((path) => path.replace(/\\/g, "/"));

  const result = await processResults(normalizedFiles, traverseResult, context);

  return result;
}
