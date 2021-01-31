import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";
import { Actions } from "@/enums";
import { createDatabaseState } from "@/modules/database";
import { delayDirective } from "@shared/helpers/delay-directive";
import { vscodePlugin } from "@shared/helpers/vscode-plugin";

const app = createApp(App);

app.provide("vscode", vscodePlugin<Actions>());
app.provide(...createDatabaseState());
app.directive("delay", delayDirective);
app.use(router);
app.mount("body");
