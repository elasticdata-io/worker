import { AbstractCommand } from './abstract-command';

export abstract class ICommandFactory {
	public abstract createCommands(commandsJson: string): AbstractCommand[];
}
