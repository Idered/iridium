import { inject } from "vue";

export function injectVSCode<Actions>() {
  type VSCode = {
    postMessage: (msg: any) => void;
    fetch: <Result>(data: { type: Actions; payload?: any }) => Promise<Result>;
    setState: (newState: any) => void;
    getState: () => any;
  };

  return inject<VSCode>("vscode") as VSCode;
}
