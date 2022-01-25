import { Controller } from "./Controller";

export type RouteAction<T> = [
  T,
  T extends new (...args: any[]) => infer R ? keyof R : never
];

export type RouteRequest = {
  requestId: string;
  uri: string;
  method: string;
  payload?: any;
};
