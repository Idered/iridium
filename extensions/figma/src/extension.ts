import "reflect-metadata";
import * as vscode from "vscode";
import { bootstrap } from "foundation/App/bootstrap";
import routes from "./routes";

export function activate(context: vscode.ExtensionContext) {
  bootstrap({
    context,
    routes,
    viewId: "iridium.figma",
  });
}

export function deactivate() {}
