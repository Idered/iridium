import { v4 } from "uuid";

declare var acquireVsCodeApi: any;

export const vscodePlugin = <Actions>() => {
  const vscode = acquireVsCodeApi();
  function fetch(data: { type: Actions; payload: any }) {
    return new Promise((resolve) => {
      const requestId = v4();
      const handleResponse = (message: MessageEvent<any>): void => {
        if (
          message.data.type === data.type &&
          message.data.requestId === requestId
        ) {
          console.log(`[VSCODE]: ${data.type}`, {
            payload: data.payload,
            result: message.data.payload,
          });
          resolve(message.data.payload);
          window.removeEventListener("message", handleResponse, false);
        }
      };
      // TODO: Handle reject
      window.addEventListener("message", handleResponse);
      vscode.postMessage({ ...JSON.parse(JSON.stringify(data)), requestId });
    });
  }
  return { ...vscode, fetch };
};
