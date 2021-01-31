import EventEmitter = require("events");
import { injectable } from "inversify";

@injectable()
export class EventService extends EventEmitter {}
