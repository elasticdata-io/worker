import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';
import { CommandInformation } from './command.information';

@injectable()
export abstract class AbstractCommandAnalyzer {
	abstract setCommandData(command: AbstractCommand, value: any): Promise<void>;
	abstract startCommand(command: AbstractCommand): Promise<void>;
	abstract endCommand(command: AbstractCommand): Promise<void>;
	abstract errorCommand(command: AbstractCommand, failureReason: string): Promise<void>;
	abstract getCommands(): Promise<CommandInformation[]>;
}
