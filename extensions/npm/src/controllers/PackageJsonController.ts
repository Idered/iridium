import { Controller } from "foundation/Routing/Controller";
import { Uri, window, workspace } from "vscode";
import { inject } from "foundation";
import { ClientManager } from "../clients/ClientManager";
import { dirname, relative } from "path";
import * as fs from "fs";
import axios from "axios";
import semver = require("semver");
// import depcheck from "./unimported-fn";

export class PackageJsonController extends Controller {
  @inject(ClientManager) private clientManager: ClientManager;

  async getPackageJSONFiles() {
    const packages = await workspace.findFiles(
      "**/package.json",
      "**/node_modules/**"
    );
    return packages.map((item) =>
      relative(workspace.workspaceFolders[0].uri.fsPath, item.fsPath)
    );
  }

  async getInstalledPackages(data: { packageJSON: string }) {
    return this.clientManager.getClient(data.packageJSON).getAllPackages();
  }

  async getSecurityAudit(data: { packageJSON: string }) {
    return this.clientManager.getClient(data.packageJSON).audit();
  }

  async installPackages(data: {
    packages: { name: string; version?: string }[];
    dev: boolean;
    packageJSON: string;
  }) {
    const query = data.packages
      .map((item) => {
        return item.version ? `${item.name}@${item.version}` : item.name;
      })
      .join(" ");
    this.clientManager.getClient(data.packageJSON).install({
      query,
      isDev: data.dev,
    });
    return {};
  }

  async updatePackages(data: {
    packages: { name: string; maxSatisfyingVersion: string }[];
    packageJSON: string;
  }) {
    const query = data.packages
      .map((item) => {
        if (item.maxSatisfyingVersion) {
          return `${item.name}@${item.maxSatisfyingVersion}`;
        }
        return item.name;
      })
      .join(" ");
    this.clientManager.getClient(data.packageJSON).update({ query });
    return {};
  }

  async removePackage(data: { packages: string[]; packageJSON: string }) {
    this.clientManager
      .getClient(data.packageJSON)
      .remove({ packages: data.packages });
    return {};
  }

  // async runDepCheck(data: { packageJSON: string }) {
  //   const path = Uri.joinPath(
  //     workspace.workspaceFolders[0].uri,
  //     data.packageJSON
  //   ).fsPath;

  //   try {
  //     const result = await depcheck(dirname(path));
  //     return { status: "success", result };
  //   } catch (err) {
  //     return { status: "error" };
  //   }
  // }

  async swapPackageType(data: {
    name: string;
    version: string;
    dev: boolean;
    packageJSON: string;
  }) {
    this.clientManager.getClient(data.packageJSON).swapType({
      packageName: data.name,
      isDev: data.dev,
      version: data.version,
    });
    return {};
  }

  async changeVersion(data: {
    name: string;
    version: string;
    originalVersion: string;
    packageJSON: string;
  }) {
    this.clientManager.getClient(data.packageJSON).install({
      query: `${data.name}@${data.version}`,
    });

    if (data.originalVersion.startsWith("^")) {
      const path = Uri.joinPath(
        workspace.workspaceFolders[0].uri,
        data.packageJSON
      ).fsPath;
      const packageJson = JSON.parse(fs.readFileSync(path, "utf8"));
      if (packageJson.dependencies?.[data.name]) {
        packageJson.dependencies[data.name] = `^${data.version}`;
      }
      if (packageJson.devDependencies?.[data.name]) {
        packageJson.devDependencies[data.name] = `^${data.version}`;
      }
      fs.writeFileSync(path, JSON.stringify(packageJson, null, 2));
    }

    return {};
  }

  async showUpdateConfirmation() {
    return await window.showInformationMessage(
      "You are about to update all packages to their latest versions based on the specified ranges. Are you sure you want to continue?",
      {
        modal: true,
      },
      "Update all"
    );
  }
}
