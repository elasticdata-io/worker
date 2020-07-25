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

	public setPageContext(commands: AbstractCommand[], pageContext: number) {
		try {
			commands.forEach(command => {
				this.commands[command.uuid] = pageContext;
			})
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
			const maxPageContext = Math.max(...Object.values(this.commands));
			this.commands[originCommand.uuid] = maxPageContext + 1;
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
