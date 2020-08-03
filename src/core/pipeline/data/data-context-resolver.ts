import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { LoopCommand } from '../v2.0/command/loop.command';
import { SystemError } from '../command/exception/system-error';

@injectable()
export class DataContextResolver {

	protected commands: any;

	constructor() {
		this.commands = {};
	}

	private setRootLoopContext(command: LoopCommand) {
		if (command.context) {
			command.setDataContext('root.0');
			return;
		}
		command.setDataContext('root');
	}

	private setChildrenDataContext(commands: AbstractCommand[], commandsContext: string) {
		commands
			.forEach(command => command.setDataContext(commandsContext));
	}

	public resolveIndex(command: AbstractCommand, contextName: string): number {
		const context = this.commands[command.uuid];
		if (contextName) {
			const contexts = context.split(`${contextName}.`);
			if (contexts.length !== 2) {
				throw new SystemError(`contextName: '${contextName}' is not correct with context: ${context}`);
			}
			return parseInt(contexts[1], 10);
		}
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
			command.setDataContext('root.0');
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public setContext(command: AbstractCommand, context: string) {
		this.commands[command.uuid] = context;
	}

	public setLoopChildrenDataContext(command: LoopCommand) {
		try {
			const loopContext = this.resolveContext(command);
			const currentContext = command.context ? `.${command.context}` : '';
			const commandsContext = `${loopContext}${currentContext}.${command.currentIndex}`;
			this.setChildrenDataContext(command.commands, commandsContext);
		} catch (e) {
			throw new SystemError(e);
		}
	}

	public copyContext(originCommand: AbstractCommand, targetCommands: AbstractCommand[]): void {
		try {
			const originContext = this.resolveContext(originCommand);
			this.setChildrenDataContext(targetCommands, originContext);
		} catch (e) {
			throw new SystemError(e);
		}
	}
}
