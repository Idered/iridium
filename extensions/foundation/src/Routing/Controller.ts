import { injectable, inject } from "inversify";
import { Webview } from "vscode";
import { VSCodeContext } from "../App/VSCodeContext";
import { VSCodeWebView } from "../App/VSCodeWebView";

@injectable()
export class Controller {
  @inject(VSCodeContext) public context: VSCodeContext;
  @inject(VSCodeWebView) public webview: Webview;
}
