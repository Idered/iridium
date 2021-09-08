import * as vscode from "vscode";
import { injectable } from "inversify";

@injectable()
export class VSCodeContext {}

export interface VSCodeContext extends vscode.ExtensionContext {}
