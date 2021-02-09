import { Container } from "inversify";
import { Bus } from "../Bus/Bus";
import { Router } from "../Routing/Router";
import { WebviewProvider } from "../Webview/WebviewProvider";

const app = new Container();

app.bind(Bus).toConstantValue(new Bus());
app.bind(Router).toSelf().inSingletonScope();
app.bind(WebviewProvider).toSelf().inSingletonScope();

export default app;
