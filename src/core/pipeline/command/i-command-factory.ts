import { AbstractCommand } from './abstract-command';
import { injectable } from 'inversify';

@injectable()
export abstract class ICommandFactory {
	public abstract createCommands(commandsJson: string): AbstractCommand[];
}
