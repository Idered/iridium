import { inject } from "vue";
import { Actions } from "../enums";

type VSCode = {
  postMessage: (msg: any) => void;
  fetch: <Result>(data: { type: Actions; payload?: any }) => Promise<Result>;
  setState: (newState: any) => void;
  getState: () => any;
};

export function useVSCode() {
  return inject<VSCode>("vscode") as VSCode;
}
