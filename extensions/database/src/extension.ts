import "reflect-metadata";
import * as vscode from "vscode";
import {
  WebviewProvider,
  WebviewProviderEvents,
} from "./providers/WebviewProvider";
import { EntityManagerService } from "./services/EntityManagerService";
import ioc from "./ioc";
import { injects } from "./enums";
import { MessengerService } from "./services/MessengerService";
import EventEmitter = require("events");

export function activate(context: vscode.ExtensionContext) {
  ioc.bind(injects.emitter).toConstantValue(new EventEmitter());
  ioc.bind(injects.context).toConstantValue(context);
  // ioc.get(EntityManagerService).watch("**/*.entity.ts");

  if (!context.workspaceState.get("connections")) {
    context.workspaceState.update("connections", []);
  }

  ioc
    .get<EventEmitter>(injects.emitter)
    .on(WebviewProviderEvents.registered, (webviewView: vscode.WebviewView) => {
      ioc.get(MessengerService).registerWebview(webviewView);
    });

  const subscription = vscode.window.registerWebviewViewProvider(
    WebviewProvider.viewId,
    ioc.get(WebviewProvider)
  );

  context.subscriptions.push(subscription);
}

export function deactivate() {}
