import * as vscode from "vscode";
import { injectable } from "inversify";

@injectable()
export class VSCodeWebView {}

export interface VSCodeWebView extends vscode.Webview {}
