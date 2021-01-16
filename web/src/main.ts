import { createApp } from "vue";
import App from "./App.vue";
declare var acquireVsCodeApi: any;

try {
  const vscode = acquireVsCodeApi();
  vscode.getState();
  console.log(vscode);
} catch (err) {}

createApp(App).mount("#app");
