import { Controller } from "foundation/Routing/Controller";
import { Uri, window, workspace } from "vscode";
import { inject } from "foundation";
import { ClientManager } from "../clients/ClientManager";
import { relative } from "path";

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

  async removePackage(data: { name: string; packageJSON: string }) {
    this.clientManager.getClient(data.packageJSON).remove(data.name);
    return {};
  }

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
    packageJSON: string;
  }) {
    this.clientManager.getClient(data.packageJSON).install({
      query: `${data.name}@${data.version}`,
    });
    return {};
  }

  async showUpdateConfirmation() {
    return await window.showInformationMessage(
      "You are about to update all packages. Are you sure you want to continue?",
      {
        modal: true,
      },
      "Update all"
    );
  }
}
