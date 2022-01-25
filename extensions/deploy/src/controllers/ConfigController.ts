import { inject, VSCodeContext, VSCodeWebView } from "foundation";
import { Controller } from "foundation/Routing/Controller";
import * as vscode from "vscode";
import * as path from "path";

export class ConfigController extends Controller {
  @inject(VSCodeContext) public context: VSCodeContext;
  @inject(VSCodeWebView) public webview: vscode.Webview;

  async getConfig() {
    const vercel = this.context.globalState.get("accessToken");

    return {
      secrets: {
        vercel,
      },
    };
  }

  async setSecret(body: { key: string; value: string | null }) {
    this.context.globalState.update(body.key, body.value);
    this.webview.postMessage({ type: "CONFIG_UPDATED" });
    return;
  }

  async getDirectories() {
    const packages = await vscode.workspace.findFiles(
      "**/package.json",
      "**/node_modules/**"
    );
    return packages.map((item) =>
      path.dirname(
        path.relative(
          vscode.workspace.workspaceFolders[0].uri.fsPath,
          item.fsPath
        )
      )
    );
  }
}
