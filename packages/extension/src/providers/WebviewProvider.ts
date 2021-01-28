import * as vscode from "vscode";
import ContentProvider from "./ContentProvider";
import { inject, injectable } from "inversify";
import { EventEmitter } from "events";
import { injects } from "../enums";

export enum WebviewProviderEvents {
  registered = "WEBVIEW_PROVIDER_registered",
}

@injectable()
export class WebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "iridium.view";
  public view?: vscode.WebviewView;
  constructor(
    @inject(injects.context) private context: vscode.ExtensionContext,
    @inject(injects.emitter) private eventService: EventEmitter
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
    this.eventService.emit(WebviewProviderEvents.registered, webviewView);
  }
}
