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
    const args = ["add", ...query.split(" "), "-E"];
    if (isDev) {
      args.push("-D");
    }
    spawn.sync("pnpm", args, {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  remove(packageName: string) {
    spawn.sync("pnpm", ["remove", packageName], {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  swapType(args: { packageName: string; isDev?: boolean; version?: string }) {
    // spawn.sync("pnpm", ["remove", args.packageName], {
    //   stdio: "inherit",
    //   cwd: this.#cwd,
    // });
    spawn.sync(
      "pnpm",
      [
        "add",
        `${args.packageName}@${args.version}`,
        args.isDev ? "-P" : "-D",
        "-E",
      ].filter(Boolean),
      {
        stdio: "inherit",
        cwd: this.#cwd,
      }
    );
  }
}
