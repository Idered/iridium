import * as vscode from "vscode";

export const openClosestPackageJson = async () => {
  const uri = vscode.window.activeTextEditor?.document.uri;
  if (uri === undefined || uri.scheme === "untitled") {
    return;
  }

  const closestPackageJson = await findUpPackageJson(uri);
  if (closestPackageJson === undefined) {
    await vscode.window.showWarningMessage("No closest package.json found");
    return;
  }

  const uriToOpen = vscode.Uri.joinPath(closestPackageJson, "package.json");
  await vscode.window.showTextDocument(uriToOpen);
};

/**
 * @param uri Initial URI of textEditor, but not directory!
 * @returns Uri with path of closest directory with package.json
 */
async function findUpPackageJson<T extends boolean = false>(
  uri: vscode.Uri,
  throws?: T
): Promise<T extends true ? vscode.Uri : vscode.Uri | undefined> {
  const currentWorkspacePath = vscode.workspace.getWorkspaceFolder(uri);
  // TODO maybe allow?
  if (!currentWorkspacePath) {
    throw new Error(
      "Opening closest package.json is not supported for files that are not part of opened workspace"
    );
  }
  const { fs } = vscode.workspace;

  let currentUri = vscode.Uri.joinPath(uri, "..");
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const fileList = await fs.readDirectory(currentUri);
    const packageJsonFile = fileList.find(
      ([name, type]) => name === "package.json" && type === vscode.FileType.File
    );
    if (packageJsonFile) return currentUri;
    if (currentUri.path === currentWorkspacePath.uri.path) {
      // console.debug('find package.json: reached workspace boundary')
      if (throws) {
        throw new Error(
          "There is no closest package.json from this file within current workspace"
        );
      }

      return undefined!;
    }

    currentUri = vscode.Uri.joinPath(currentUri, "..");
  }
}
