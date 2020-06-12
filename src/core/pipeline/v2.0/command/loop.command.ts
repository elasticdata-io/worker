import { AbstractCommand } from '../../command/abstract-command';
import { TYPES as ROOT_TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { SystemError } from '../../command/exception/system-error';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';

@Cmd({cmd: 'loop'})
export class LoopCommand extends AbstractCommand {

	@Assignable({required: false})
	public context?: string = '';

	@Assignable({required: false})
	public index?: number = 0;

	@Assignable({required: false})
	public max?: number = 20;

	@Assignable()
	public commands: AbstractCommand[] = [];

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
