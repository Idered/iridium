import type { RouteRequest } from "./types";
import { RouteParser } from "./RouteParser";
import { Controller } from "./Controller";

export class Route<C extends Controller = Controller> {
  /**
   * The URI pattern the route responds to.
   */
  uri: string;

  /**
   * The HTTP methods the route responds to.
   */
  methods: string[];

  /**
   * The route action.
   */
  action: string;

  /**
   * The controller instance.
   */
  controller: any;

  /**
   * The object of matched parameters.
   */
  $parameters?: Record<string, string>;

  /**
   * The parameter names for the route.
   */
  parametersNames?: string[];

  constructor(args: {
    uri: string;
    methods: string[];
    action: string;
    controller: C;
  }) {
    this.uri = args.uri;
    this.controller = args.controller;
    this.methods = args.methods;
    this.action = args.action;
  }

  private get routeParser() {
    return new RouteParser(this.uri);
  }

  public match(request: RouteRequest) {
    const uriMatch = this.routeParser.match(request.uri);
    const methodMatch = this.methods.includes(request.method);
    return uriMatch && methodMatch;
  }

  public getParameters(request: RouteRequest): Record<string, string> {
    return { ...this.routeParser.getParams(request.uri) } || {};
  }
}
