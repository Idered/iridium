import * as vscode from "vscode";
import { Container, inject, injectable } from "inversify";
import { Route } from "./Route";
import { RouteAction, RouteRequest } from "./types";
import { VSCodeContext } from "../App/VSCodeContext";

@injectable()
export class Router {
  private routes = [] as Route[];

  constructor(
    private context: VSCodeContext,
    @inject("app") private container: Container
  ) {}

  public get(uri: string, action: RouteAction) {
    return this.addRoute("GET", uri, action);
  }

  public post(uri: string, action: RouteAction) {
    return this.addRoute("POST", uri, action);
  }

  public patch(uri: string, action: RouteAction) {
    return this.addRoute("PATCH", uri, action);
  }

  public put(uri: string, action: RouteAction) {
    return this.addRoute("PUT", uri, action);
  }

  public delete(uri: string, action: RouteAction) {
    return this.addRoute("DELETE", uri, action);
  }

  private addRoute(method: string, uri: string, action: RouteAction) {
    const route = this.createRoute(method, uri, action);
    this.routes.push(route);
    if (!this.container.isBound(route.controller)) {
      this.container.bind(route.controller).toSelf();
    }
  }

  private createRoute(
    method: string,
    uri: string,
    [controller, action]: RouteAction
  ) {
    return new Route({ uri, method, action, controller });
  }

  public registerWebview(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(
      (event) => this.handle(event, webviewView),
      undefined,
      this.context.subscriptions
    );
  }

  private findRoute(request: RouteRequest) {
    return this.routes.find((item) => item.match(request));
  }

  private async handle(request: RouteRequest, webviewView: vscode.WebviewView) {
    const route = this.findRoute(request);

    if (!route) {
      return webviewView.webview.postMessage({
        requestId: request.requestId,
        uri: request.uri,
        method: request.method,
        status: 400,
        payload: {
          message: `Route [${request.uri}] not defined.`,
        },
      });
    }

    const controller = this.container.get<any>(route.controller);
    const result = await controller[route.action](request.payload);

    if (result !== undefined) {
      webviewView.webview.postMessage({
        requestId: request.requestId,
        uri: request.uri,
        method: request.method,
        payload: result,
      });
    }
  }
}
