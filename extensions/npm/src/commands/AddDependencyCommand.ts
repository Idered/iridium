import * as vscode from "vscode";
import {
  Container,
  inject,
  injectable,
  VSCodeContext,
  VSCodeWebView,
} from "foundation";
import { WebviewProviderEvents } from "foundation/Webview/WebviewProvider";
import { Bus } from "foundation/Bus/Bus";

@injectable()
export class AddDependencyCommand {
  focusOnWebviewRegister: boolean;

  constructor(
    @inject(VSCodeContext) private context: vscode.ExtensionContext,
    @inject(Bus) private bus: Bus,
    @inject("app") private container: Container
  ) {
    this.context.subscriptions.push(this.command());

    this.bus.on(
      WebviewProviderEvents.registered,
      (webview: vscode.WebviewView) => {
        if (!this.focusOnWebviewRegister) return;
        webview.webview.onDidReceiveMessage((message) => {
          if (message?.type !== "AUTOCOMPLETE_INPUT_MOUNTED") return;
          this.focusOnWebviewRegister = false;
          this.focusInput();
        });
      }
    );
  }

  async focusInput() {
    if (this.container.isBound(VSCodeWebView)) {
      const webviewView = this.container.get(VSCodeWebView);
      await webviewView.postMessage({ type: "FOCUS_INPUT" });
    } else {
      this.focusOnWebviewRegister = true;
    }
  }

  command() {
    return vscode.commands.registerCommand(
      "iridium.npm.addDependency",
      async () => {
        await vscode.commands.executeCommand(
          "workbench.view.extension.iridium"
        );
        await this.focusInput();
      }
    );
  }
}
