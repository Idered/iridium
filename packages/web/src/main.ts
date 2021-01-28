import { v4 } from "uuid";
import { createApp } from "vue";
import App from "./App.vue";
import { Actions } from "./enums";
import { createDatabaseState } from "./modules/database";
import router from "./router";

declare var acquireVsCodeApi: any;

const app = createApp(App);

const vscodePlugin = () => {
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

app.provide("vscode", vscodePlugin());
app.provide(...createDatabaseState());
app.use(router);
app.directive("delay", {
  mounted(_el, instance, node) {
    console.log(node);
    setTimeout(node.props?.callback, instance.value || 3000);
  },
});
router.push("database");
app.mount("#app");
