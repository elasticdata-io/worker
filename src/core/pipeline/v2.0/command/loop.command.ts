import { AbstractCommand } from '../../command/abstract-command';
import { TYPES as ROOT_TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';

export class LoopCommand extends AbstractCommand {

	context?: string = '';
	index?: number = 0;
	max?: number = 20;
	commands: AbstractCommand[];

	async execute(): Promise<void> {
		try {
			this.index = 0;
			for (let i = 0; i < this.max; i++) {
				await this.applyChildCommandsContext();
				const firstCommand = this.commands[0];
				await this.browserProvider.execute(firstCommand);
				this.index++;
			}
		} catch (e) {
			console.error(e);
		}
		await super.execute();
	}

	private async applyChildCommandsContext() {
		const contextResolver = this.ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		const loopContext = contextResolver.resolveContext(this);
		const currentContext = this.context ? `.${this.context}` : '';
		const commandsContext = `${loopContext}${currentContext}.${this.index}`;
		contextResolver.setChildCommandsContext(this.commands, commandsContext);
	}
}
