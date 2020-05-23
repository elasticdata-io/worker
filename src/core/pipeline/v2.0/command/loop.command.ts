import { AbstractCommand } from '../../command/abstract-command';
import { TYPES as ROOT_TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { SystemError } from '../../command/exception/system-error';

export class LoopCommand extends AbstractCommand {

	context?: string = '';
	index?: number = 0;
	max?: number = 20;
	commands: AbstractCommand[] = [];

	async execute(): Promise<void> {
		try {
			this.index = 0;
			for (let i = 0; i < this.max; i++) {
				await this.applyChildrenContext();
				const firstCommand = this.commands[0];
				await this.browserProvider.execute(firstCommand);
				this.index++;
			}
		} catch (e) {
			if (e instanceof SystemError) {
				throw e;
			}
			console.error(e);
		}
		await super.execute();
	}

	private async applyChildrenContext() {
		const contextResolver = this.ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		contextResolver.setLoopChildrenContext(this);
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['index', 'max', 'context']);
	}
}
