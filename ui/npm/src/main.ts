import App from "./App.vue";
import { createApp } from "vue";
import { vscodePlugin } from "@shared/helpers/vscode-plugin";
import { key, store } from "./lib/store";
import { VueQueryPlugin } from "vue-query";
import "./index.css";

const app = createApp(App);

app.use(store, key);
app.use(VueQueryPlugin);
app.provide("vscode", vscodePlugin());
app.mount("body");
