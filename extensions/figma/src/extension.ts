import "reflect-metadata";
import * as vscode from "vscode";
import routes from "./routes";
import { bootstrap } from "./foundation/App/bootstrap";

export function activate(context: vscode.ExtensionContext) {
  bootstrap({
    context,
    routes,
    viewId: "iridium.figma",
  });
}

export function deactivate() {}
