import App from "@/App.vue";
import { createApp } from "vue";
import { vscodePlugin } from "@shared/helpers/vscode-plugin";

const app = createApp(App);

app.provide("vscode", vscodePlugin());
app.mount("body");
