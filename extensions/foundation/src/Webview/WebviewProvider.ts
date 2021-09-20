import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { inject, injectable } from "inversify";
import { Bus } from "../Bus/Bus";
import { VSCodeContext } from "../App/VSCodeContext";

export enum WebviewProviderEvents {
  registered = "WEBVIEW_PROVIDER_registered",
}

@injectable()
export class WebviewProvider implements vscode.WebviewViewProvider {
  public view?: vscode.WebviewView;

  constructor(
    @inject(VSCodeContext) private context: VSCodeContext,
    @inject(Bus) private bus: Bus
  ) {}

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
    this.bus.emit(WebviewProviderEvents.registered, webviewView);
  }
}
