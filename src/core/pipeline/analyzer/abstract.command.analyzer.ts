import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';
import { CommandInformation } from './command.information';
import {PipelineCommandEvent} from "../enum/event/pipeline-command.event";

@injectable()
export abstract class AbstractCommandAnalyzer {
	abstract setCommandData(command: AbstractCommand, value: any): Promise<void>;
	abstract startCommand(command: AbstractCommand): Promise<void>;
	abstract endCommand(command: AbstractCommand): Promise<void>;
	abstract errorCommand(command: AbstractCommand, failureReason: string): Promise<void>;
	abstract getCommands(): Promise<CommandInformation[]>;
	abstract subscribe(event: PipelineCommandEvent, callbackFn: (arg: any) => void): void;
	abstract unsubscribeAll(): void;
}
