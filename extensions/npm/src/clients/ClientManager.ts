import { inject, injectable } from "foundation";
import { existsSync } from "fs";
import { dirname } from "path";
import { Uri, workspace } from "vscode";
import { NpmClient } from "./NpmClient";
import { PnpmClient } from "./PnpmClient";
import { YarnClient } from "./YarnClient";
import { BunClient } from "./BunClient";

@injectable()
export class ClientManager {
  @inject(NpmClient) npm: NpmClient;
  @inject(YarnClient) yarn: YarnClient;
  @inject(PnpmClient) pnpm: PnpmClient;
  @inject(BunClient) bun: BunClient;

  getClient(packageJSON: string) {
    const uri = Uri.joinPath(workspace.workspaceFolders[0].uri, packageJSON);
    const dir = dirname(uri.fsPath);
    const bunLockExists = existsSync(`${dir}/bun.lockb`);
    const yarnLockExists = existsSync(`${dir}/yarn.lock`);
    const packageLockExists = existsSync(`${dir}/package-lock.json`);
    const pnpmLockExists = existsSync(`${dir}/pnpm-lock.yaml`);
    const configuredPackageManager = workspace
      .getConfiguration("iridium")
      .get<"npm" | "yarn" | "pnpm" | "bun">("npm.packageManager");
    const client = yarnLockExists
      ? this.yarn
      : packageLockExists
      ? this.npm
      : pnpmLockExists
      ? this.pnpm
      : bunLockExists
      ? this.bun
      : this[configuredPackageManager];

    return client.cwdFromUri(uri);
  }
}
