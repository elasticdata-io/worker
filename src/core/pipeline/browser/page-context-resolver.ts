import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { SystemError } from '../command/exception/system-error';

@injectable()
export class PageContextResolver {

	protected commands: { [key: string]: number };

	constructor() {
		this.commands = {};
	}

	public resolvePageContext(command: AbstractCommand): number {
		try {
			return this.commands[command.uuid];
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setRootPageContext(command: AbstractCommand) {
		try {
			this.commands[command.uuid] = 0;
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public increaseCommandsContext(originCommand: AbstractCommand, targetCommands: AbstractCommand[]) {
		try {
			const originPageContext = this.commands[originCommand.uuid];
			targetCommands.forEach(targetCommand => {
				this.commands[targetCommand.uuid] = originPageContext + 1;
			});
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
