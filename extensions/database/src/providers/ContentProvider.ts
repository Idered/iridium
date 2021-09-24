import * as vscode from "vscode";
import { join } from "path";
import { readFileSync } from "fs";

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

  getDevServerContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <script type="module" src="http://localhost:3000/@vite/client"></script>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="http://localhost:3000/src/main.ts"></script>
    </body>
    </html>
      `;
  }

  getProductionContent(context: vscode.ExtensionContext) {
    const uiPath = join(context.extensionPath, "out", "ui");
    const manifestPath = join(uiPath, "manifest.json");
    const manifestContent = readFileSync(manifestPath);
    const manifest = JSON.parse(manifestContent.toString());

    const indexJS = join(uiPath, manifest["index.html"].file);
    const indexCSS = join(uiPath, manifest["index.html"].css[0]);
    const [vendorName] = manifest["index.html"].imports;
    const vendorJS = join(uiPath, manifest[vendorName].file);

    const index = vscode.Uri.file(indexJS);
    const indexURI = index.with({ scheme: "vscode-resource" });
    const css = vscode.Uri.file(indexCSS);
    const cssURI = css.with({ scheme: "vscode-resource" });
    const vendor = vscode.Uri.file(vendorJS);
    const vendorURI = vendor.with({
      scheme: "vscode-resource",
    });

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <link href="${cssURI}" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="${indexURI}"></script>
      <script type="module" src="${vendorURI}"></script>
    </body>
    </html>
      `;
  }

  getContent(context: vscode.ExtensionContext) {
    if (process.env.NODE_ENV === "production") {
      return this.getProductionContent(context);
    }
    return this.getDevServerContent();
  }
}
