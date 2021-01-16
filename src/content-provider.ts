import * as vscode from "vscode";
import { join } from "path";

export default class ContentProvider {
  private getNonce() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getDevServerContent(webviewView: vscode.WebviewView) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script type="module" src="http://localhost:3000/@vite/client"></script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="http://localhost:3000/src/main.ts"></script>
    </body>
    </html
      `;
  }

  getProductionContent(context: vscode.ExtensionContext) {
    const unBundleDiskPath = vscode.Uri.file(
      join(context.extensionPath, "out", "ui", "ui.bundle.js")
    );
    const unBundlePath = unBundleDiskPath.with({ scheme: "vscode-resource" });

    return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <title>Figma</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="${unBundlePath}" type="text/javascript"></script>
  </body>
</html>
    `;
  }

  getContent(
    context: vscode.ExtensionContext,
    webviewView: vscode.WebviewView
  ) {
    if (process.env.PRODUCTION) {
      // return this.getProductionContent(context);
    }

    return this.getDevServerContent(webviewView);
  }
}
