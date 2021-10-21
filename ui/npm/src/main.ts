import App from "./App.vue";
import { createApp } from "vue";
import { vscodePlugin } from "@shared/helpers/vscode-plugin";
import { key, store } from "./lib/store";

const app = createApp(App);

app.use(store, key);
app.provide("vscode", vscodePlugin());
app.mount("body");
