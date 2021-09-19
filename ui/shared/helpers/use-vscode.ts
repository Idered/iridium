import { inject } from "vue";

export type VSCode = {
  fetch: {
    get: <Result>(uri: string) => Promise<Result>;
    post: <Result>(uri: string, payload?: any) => Promise<Result>;
    patch: <Result>(uri: string, payload?: any) => Promise<Result>;
    put: <Result>(uri: string, payload?: any) => Promise<Result>;
    delete: <Result>(uri: string) => Promise<Result>;
  };
};

export function useVSCode() {
  return inject<VSCode>("vscode") as VSCode;
}
