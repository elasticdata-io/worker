import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { LoopCommand } from '../v2.0/command/loop.command';
import { TYPES as ROOT_TYPES } from '../types';
import { SystemError } from '../command/exception/system-error';

@injectable()
export class DataContextResolver {

	protected commands: any;

	constructor() {
		this.commands = {};
	}

	private setRootLoopContext(command: LoopCommand) {
		if (command.context) {
			this.commands[command.uuid] = 'root.0';
			return;
		}
		this.commands[command.uuid] = 'root';
	}

	private setChildrenContext(commands: AbstractCommand[], commandsContext: string) {
		commands.forEach(command => {
			this.commands[command.uuid] = commandsContext;
		});
	}

	public resolveIndex(command: AbstractCommand): number {
		const context = this.commands[command.uuid];
		return context.replace(/^.*([0-9]+)$/, "$1");
	}

	public resolveContext(command: AbstractCommand): string {
		try {
			return this.commands[command.uuid];
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setRootContext(command: AbstractCommand) {
		try {
			if (command instanceof LoopCommand) {
				this.setRootLoopContext(command);
				return;
			}
			this.commands[command.uuid] = 'root.0';
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setLoopChildrenContext(command: LoopCommand) {
		try {
			const loopContext = this.resolveContext(command);
			const currentContext = command.context ? `.${command.context}` : '';
			const commandsContext = `${loopContext}${currentContext}.${command.index}`;
			this.setChildrenContext(command.commands, commandsContext);
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
