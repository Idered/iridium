import * as vscode from "vscode";
import { Actions, injects } from "../enums";
import { inject, injectable } from "inversify";
import { EntityManagerService } from "./EntityManagerService";
import { ApiService } from "./ApiService";

@injectable()
export class MessengerService {
  constructor(
    @inject(EntityManagerService)
    private entityManagerService: EntityManagerService,
    @inject(ApiService)
    private apiService: ApiService,
    @inject(injects.context) private context: vscode.ExtensionContext
  ) {}

  registerWebview(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(
      (event) => this.handleMessage(event, webviewView),
      undefined,
      this.context.subscriptions
    );
  }

  private async handleMessage(
    event: { requestId: string; type: Actions; payload?: any },
    webviewView: vscode.WebviewView
  ) {
    const result = await this.apiService[event.type](event.payload);
    if (result !== undefined) {
      webviewView.webview.postMessage({
        requestId: event.requestId,
        type: event.type,
        payload: result,
      });
    }
  }
}
