import { inject } from "vue";

export function useVSCode() {
  type VSCode = {
    fetch: {
      get: <Result>(uri: string) => Promise<Result>;
      post: <Result>(uri: string, payload?: any) => Promise<Result>;
      patch: <Result>(uri: string, payload?: any) => Promise<Result>;
      put: <Result>(uri: string, payload?: any) => Promise<Result>;
      delete: <Result>(uri: string) => Promise<Result>;
    };
  };

  return inject<VSCode>("vscode") as VSCode;
}
