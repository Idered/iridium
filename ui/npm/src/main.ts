import App from "./App.vue";
import { createApp } from "vue";
import { vscodePlugin } from "@shared/helpers/vscode-plugin";
import { key, store } from "./lib/store";
import "./index.css";

const app = createApp(App);

app.use(store, key);
app.provide("vscode", vscodePlugin());
app.mount("body");
