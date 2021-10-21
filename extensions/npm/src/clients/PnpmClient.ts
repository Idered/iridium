import * as fs from "fs";
import * as spawn from "cross-spawn";
import { dirname } from "path";
import { Client } from "./Client";
import { Uri } from "vscode";
import { injectable } from "foundation";

@injectable()
export class PnpmClient extends Client {
  #uri: Uri;
  #cwd: string;
  cwdFromUri(uri: Uri) {
    this.#uri = uri;
    this.#cwd = dirname(uri.fsPath);
    return this;
  }
  getAllPackages() {
    const contents = fs.readFileSync(this.#uri.fsPath, "utf8");
    const json = JSON.parse(contents);
    const allDependencies = {
      ...(json.dependencies || {}),
      ...(json.devDependencies || {}),
    };
    const devDependencies = Object.keys(json.devDependencies || {});
    return Object.entries(allDependencies).reduce((all, [name, version]) => {
      const isDevDependency = devDependencies.includes(name);
      return all.concat({ name, version, isDevDependency });
    }, []);
  }
  install({ isDev, query }: { query: string; isDev?: boolean }) {
    const args = ["add", ...query.split(" ")];
    if (isDev) {
      args.push("-D");
    }
    spawn.sync("pnpm", args, {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  update({ query }: { query: string }) {
    const args = ["update", ...query.split(" ")];
    spawn.sync("pnpm", args, {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  remove({ packages }: { packages: string[] }) {
    spawn.sync("pnpm", ["remove", ...packages], {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  swapType(args: { packageName: string; isDev?: boolean; version?: string }) {
    spawn.sync(
      "pnpm",
      [
        "add",
        `${args.packageName}@${args.version}`,
        args.isDev ? "-P" : "-D",
      ].filter(Boolean),
      {
        stdio: "inherit",
        cwd: this.#cwd,
      }
    );
  }
}
