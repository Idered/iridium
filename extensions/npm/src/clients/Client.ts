import { injectable } from "foundation";
import { Uri } from "vscode";

@injectable()
export abstract class Client {
  abstract cwdFromUri(uri: Uri): this;
  abstract getAllPackages(): {
    name: string;
    version: string;
    isDevDependency: boolean;
  }[];
  abstract install(args: { query: string; isDev?: boolean }): void;
  abstract update(args: { query: string }): void;
  abstract remove(packageName: string): void;
  abstract swapType(args: {
    packageName: string;
    isDev?: boolean;
    version?: string;
  }): void;
}
