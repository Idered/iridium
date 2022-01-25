import * as vscode from "vscode";
import { join } from "path";
import { readFileSync } from "fs";

export default class ContentProvider {
  getDevServerContent(
    context: vscode.ExtensionContext,
    webviewView: vscode.WebviewView
  ) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script type="module" src="http://localhost:3000/@vite/client"></script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body data-view="${webviewView.viewType}">
      <div id="app"></div>
      <script type="module" src="http://localhost:3000/src/main.ts"></script>
    </body>
    </html>
      `;
  }

  getProductionContent(
    context: vscode.ExtensionContext,
    webviewView: vscode.WebviewView
  ) {
    const uiPath = join(context.extensionPath, "out", "ui");
    const manifestPath = join(uiPath, "manifest.json");
    const manifestContent = readFileSync(manifestPath);
    const manifest = JSON.parse(manifestContent.toString());

    const indexJS = vscode.Uri.file(
      join(context.extensionPath, "out", "ui", manifest["index.html"].file)
    );
    const indexCSS = vscode.Uri.file(
      join(context.extensionPath, "out", "ui", manifest["index.html"].css[0])
    );
    const [vendorName] = manifest["index.html"].imports;
    const vendorJS = vscode.Uri.file(
      join(context.extensionPath, "out", "ui", manifest[vendorName].file)
    );

    const index = webviewView.webview.asWebviewUri(indexJS);
    const css = webviewView.webview.asWebviewUri(indexCSS);
    const vendor = webviewView.webview.asWebviewUri(vendorJS);
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link href="${css}" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <script type="module" src="${index}"></script>
      <script type="module" src="${vendor}"></script>
    </body>
    </html>
      `;
  }

  getContent(
    context: vscode.ExtensionContext,
    webviewView: vscode.WebviewView
  ) {
    if (process.env.NODE_ENV === "production") {
      return this.getProductionContent(context, webviewView);
    }
    return this.getDevServerContent(context, webviewView);
  }
}
