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
	summary: `doc.LOOP.SUMMARY`
})
export class LoopCommand extends AbstractCommand {

	@Assignable({
		required: false,
		summary: `doc.LOOP.PROPS.CONTEXT.SUMMARY`,
		type: String,
		default: '',
	})
	public context?: string = '';

	@Assignable({
		required: false,
		type: Number,
		default: 0,
		summary: `doc.LOOP.PROPS.INDEX.SUMMARY`,
	})
	public index?: number = 0;

	@Assignable({
		required: false,
		type: Number,
		default: 20,
		summary: `doc.LOOP.PROPS.MAX.SUMMARY`,
	})
	public max?: number = 20;

	@Assignable({
		type: Array,
		default: [],
		summary: `doc.LOOP.PROPS.COMMANDS.SUMMARY`,
	})
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
