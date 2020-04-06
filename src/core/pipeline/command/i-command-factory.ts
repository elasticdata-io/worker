import { AbstractCommand } from './abstract-command';
import { injectable } from 'inversify';

@injectable()
export abstract class ICommandFactory {
	public abstract appendUuidToCommands(commandsJson: string): string;
	public abstract createChainCommands(commandsJson: string): AbstractCommand[];
}
