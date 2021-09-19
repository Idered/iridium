import { inject, injectable } from "foundation";
import { existsSync } from "fs";
import { dirname } from "path";
import { Uri, workspace } from "vscode";
import { NpmClient } from "./NpmClient";
import { PnpmClient } from "./PnpmClient";
import { YarnClient } from "./YarnClient";

@injectable()
export class ClientManager {
  @inject(NpmClient) npm: NpmClient;
  @inject(YarnClient) yarn: YarnClient;
  @inject(PnpmClient) pnpm: PnpmClient;

  getClient(packageJSON: string) {
    const uri = Uri.joinPath(workspace.workspaceFolders[0].uri, packageJSON);
    const dir = dirname(uri.fsPath);
    const yarnLockExists = existsSync(`${dir}/yarn.lock`);
    const packageLockExists = existsSync(`${dir}/package-lock.json`);
    const pnpmLockExists = existsSync(`${dir}/pnpm-lock.yaml`);
    const configuredPackageManager = workspace
      .getConfiguration("iridium")
      .get<"npm" | "yarn" | "pnpm">("npm.packageManager");
    const client = yarnLockExists
      ? this.yarn
      : packageLockExists
      ? this.npm
      : pnpmLockExists
      ? this.pnpm
      : this[configuredPackageManager];

    return client.cwdFromUri(uri);
  }
}
