import { Container } from "inversify";
import { WebviewProvider } from "./providers/WebviewProvider";
import { ApiService } from "./services/ApiService";
import { EntityManagerService } from "./services/EntityManagerService";
import { MessengerService } from "./services/MessengerService";
import { StoreService } from "./services/StoreService";

const ioc = new Container();

ioc.bind(MessengerService).toSelf().inSingletonScope();
ioc.bind(StoreService).toSelf().inSingletonScope();
ioc.bind(WebviewProvider).toSelf().inSingletonScope();
ioc.bind(EntityManagerService).toSelf().inSingletonScope();
ioc.bind(ApiService).toSelf().inSingletonScope();

export default ioc;
