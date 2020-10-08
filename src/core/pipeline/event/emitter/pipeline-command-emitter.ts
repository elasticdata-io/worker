import { EventEmitter } from "events";

export class PipelineCommandEmitter extends EventEmitter {}
export const pipelineCommandEmitter = new PipelineCommandEmitter();
