import { AbstractCommand } from '../../command/abstract-command';
import { TYPES as ROOT_TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { SystemError } from '../../command/exception/system-error';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'loop',
	version: '2.0',
	type: CommandType.OTHER,
	summary: `Команда дозволяє, в циклі, повторювати будь-які інструкції (команди)`
})
export class LoopCommand extends AbstractCommand {

	@Assignable({
		required: false,
		summary: `json ключ, для внутрішніх команд в блоці commands`,
		type: String,
		default: '',
	})
	public context?: string = '';

	@Assignable({required: false, type: Number, default: 0})
	public index?: number = 0;

	@Assignable({required: false, type: Number, default: 20})
	public max?: number = 20;

	@Assignable({type: Array, default: []})
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
