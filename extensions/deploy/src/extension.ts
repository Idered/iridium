import "reflect-metadata";
import * as vscode from "vscode";
import { bootstrap } from "foundation/App/bootstrap";
import routes from "./routes";
import { VercelClient } from "./clients/VercelClient";
import { Bus } from "foundation/Bus/Bus";
import { WebviewProviderEvents } from "foundation/Webview/WebviewProvider";

export function activate(context: vscode.ExtensionContext) {
  const App = bootstrap({
    context,
    routes,
    viewId: [
      "iridium-deploy.vercel",
      "iridium-deploy.netlify",
      "iridium-deploy.surge",
      "iridium-deploy.githubPages",
    ],
  });
  App.bind(VercelClient).toSelf();
}

export function deactivate() {}
