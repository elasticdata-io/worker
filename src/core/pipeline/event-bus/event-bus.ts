import * as Emittery from "emittery";

class EventBus extends Emittery {}

export const eventBus = new EventBus();
