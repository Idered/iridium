import { RouteRequest } from "./types";

export class Route {
  uri: string;
  method: string;
  controller: any;
  action: string;
  parameters?: string[];

  constructor(args: {
    uri: string;
    controller: any;
    method: string;
    action: string;
  }) {
    this.uri = args.uri;
    this.controller = args.controller;
    this.method = args.method;
    this.action = args.action;
  }

  public match(request: RouteRequest) {
    const uriMatch = this.uri === request.uri;
    const methodMatch = this.method === request.method;

    return uriMatch && methodMatch;
  }

  public parameterNames() {
    if (this.parameters !== undefined) {
      return this.parameters;
    }

    return (this.parameters = this.compileParameterNames());
  }

  protected compileParameterNames() {
    const names = this.uri.match(/\{(.*?)\}/g) || [];

    return names.map((item) => item.slice(1, -1).replace(/\?$/, ""));
  }
}
