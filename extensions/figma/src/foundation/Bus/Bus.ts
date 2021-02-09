import EventEmitter = require("events");
import { injectable } from "inversify";

@injectable()
export class Bus extends EventEmitter {}
