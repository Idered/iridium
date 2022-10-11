import * as fs from "fs";
import * as spawn from "cross-spawn";
import { dirname } from "path";
import { Client } from "./Client";
import { Uri } from "vscode";
import { injectable } from "foundation";

@injectable()
export class NpmClient extends Client {
  #uri: Uri;
  #cwd: string;
  cwdFromUri(uri: Uri) {
    this.#uri = uri;
    this.#cwd = dirname(uri.fsPath);
    return this;
  }
  audit() {
    return null;
    // const { stdout } = spawn.sync("npm", ["audit", "--json"], {
    //   cwd: this.#cwd,
    // });
    // console.log(JSON.parse(stdout.toString()));
    // return JSON.parse(stdout.toString());
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
  install({ isDev, query }: { isDev?: boolean; query: string }) {
    const args = ["install", ...query.split(" ")];
    if (isDev) {
      args.push("--save-dev");
    }
    spawn.sync("npm", args, {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  update({ query }: { query: string }) {
    const args = ["update", ...query.split(" ")];
    spawn.sync("npm", args, {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  remove({ packages }: { packages: string[] }) {
    spawn.sync("npm", ["remove", ...packages], {
      stdio: "inherit",
      cwd: this.#cwd,
    });
  }
  swapType(args: { packageName: string; isDev?: boolean; version?: string }) {
    spawn.sync(
      "npm",
      [
        "install",
        `${args.packageName}@${args.version}`,
        args.isDev ? "--save-prod" : "--save-dev",
      ],
      {
        stdio: "inherit",
        cwd: this.#cwd,
      }
    );
  }
}
