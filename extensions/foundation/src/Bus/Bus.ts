import * as EventEmitter from "events";
import { injectable } from "inversify";

@injectable()
export class Bus extends EventEmitter {}
