import * as vscode from "vscode";
import ContentProvider from "./content-provider";

export class WebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "iridium.view";

  constructor(private readonly context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    const contentProvider = new ContentProvider();

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webviewView.webview.html = contentProvider.getContent(
      this.context,
      webviewView
    );
  }
}
