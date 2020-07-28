import { AbstractCommand } from './abstract-command';
import { injectable } from 'inversify';
import { OpenTabCommand } from '../v2.0/command/open-tab.command';
import { OpenTabRuntimeCommand } from '../v2.0/command/async/open-tab-runtime.command';

@injectable()
export abstract class ICommandFactory {
	public abstract appendUuidToCommands(commandsJson: string): string;
	public abstract createChainCommands(commandsJson: string): AbstractCommand[];
	public abstract createOpenTabRuntimeCommand(config: {
		openTabCommand: OpenTabCommand,
		dataContext: string,
		pageContext: number,
	}): OpenTabRuntimeCommand;
}
