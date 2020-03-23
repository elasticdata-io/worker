import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';

@injectable()
export class DataContextResolver {

	protected commands: any;

	constructor() {
		this.commands = {};
	}

	public resolveIndex(command: AbstractCommand): number {
		const context = this.commands[command.uuid];
		return context.replace(/^.*([0-9]+)$/, "$1");
	}

	public resolveContext(command: AbstractCommand): string {
		return this.commands[command.uuid];
	}

	public setRootContext(command: AbstractCommand) {
		this.commands[command.uuid] = 'root.0';
	}

	public setChildCommandsContext(commands: AbstractCommand[], commandsContext: string) {
		commands.forEach(command => {
			this.commands[command.uuid] = commandsContext;
		});
	}
}
