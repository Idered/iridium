export type RouteAction = [Function, string];

export type RouteRequest = {
  requestId: string;
  uri: string;
  method: string;
  payload?: any;
};
