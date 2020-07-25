import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { SystemError } from '../command/exception/system-error';
import {OpenTabCommand} from "../v2.0/command/open-tab.command";

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

	public async increaseContext(originCommand: OpenTabCommand): Promise<void> {
		try {
			const originPageContext = Math.max(...Object.values(this.commands));
			this.commands[originCommand.uuid] = originPageContext + 1;
			this._increaseCommandsContext(originCommand, originCommand.commands);
		} catch (e) {
			throw new SystemError(e);
		}
	}

	private _increaseCommandsContext(originCommand: OpenTabCommand, targetCommands: AbstractCommand[]) {
		try {
			const originPageContext = this.commands[originCommand.uuid];
			targetCommands.forEach(targetCommand => {
				this.commands[targetCommand.uuid] = originPageContext;
			});
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
