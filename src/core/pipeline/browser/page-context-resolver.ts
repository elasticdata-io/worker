import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { SystemError } from '../command/exception/system-error';
import { OpenTabAsyncCommand } from '../v2.0/command/async/open-tab.async.command';

@injectable()
export class PageContextResolver {

	protected commands: { [key: string]: number };

	constructor() {
		this.commands = {};
	}

	public resolveContext(command: AbstractCommand): number {
		try {
			return this.commands[command.uuid];
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setContext(command: AbstractCommand, pageContext: number) {
		try {
			this.commands[command.uuid] = pageContext;
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setRootContext(command: AbstractCommand) {
		try {
			command.setPageContext(0);
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public increaseContext(originCommand: OpenTabAsyncCommand): void {
		try {
			const maxPageContext = Math.max(...Object.values(this.commands));
			this.commands[originCommand.uuid] = maxPageContext + 1;
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public copyContext(originCommand: AbstractCommand, targetCommands: AbstractCommand[]): void {
		try {
			const originContext = this.commands[originCommand.uuid];
			if (originContext === undefined || originContext === null) {
				throw new Error(`origin command: ${originCommand.constructor.name} page context not found`);
			}
			targetCommands.forEach(targetCommand => targetCommand.setPageContext(originContext));
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
