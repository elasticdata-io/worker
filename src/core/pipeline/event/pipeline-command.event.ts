import * as Emittery from "emittery";

export enum PipelineCommandEvent {
	START_EXECUTE_COMMAND = 'START_EXECUTE_COMMAND',
	BEFORE_EXECUTE_NEXT_COMMAND = 'BEFORE_EXECUTE_NEXT_COMMAND',
}

class PipelineCommandEmitter extends Emittery {}
export const pipelineCommandEmitter = new PipelineCommandEmitter();
