import { EventEmitter } from "events";
import { inject, injectable } from "inversify";
import { injects } from "../enums";

export enum StoreServiceEvents {
  updated = "STORE_SERVICE_updated",
}

@injectable()
export class StoreService {
  private state: Record<string, any> = {};

  constructor(@inject(injects.emitter) private emitter: EventEmitter) {}

  set(key: string, value: any) {
    this.state[key] = value;
    this.emitter.emit(StoreServiceEvents.updated, this.state, { key, value });
  }

  get(key?: string) {
    return key ? this.state[key] : this.state;
  }
}
