import { AbstractCommand } from '../../command/abstract-command';
import {Cmd} from "../../command/decorator/command.decorator";
import {CommandType} from "../../documentation/specification";
import {Assignable} from "../../command/decorator/assignable.decorator";
import {DataContextResolver} from "../../data/data-context-resolver";
import {TYPES as ROOT_TYPES} from "../../types";
import {PageContextResolver} from "../../browser/page-context-resolver";

/**
 * Open new tab with old browser session.
 */
@Cmd({
	cmd: 'opentab',
	version: '2.0',
	summary: 'Open new browser tab',
	type: CommandType.ACTION,
})
export class OpenTabCommand extends AbstractCommand {

	@Assignable({
		required: false,
		type: Number,
		default: 2
	})
	public timeout = 2;

	@Assignable({
		required: true,
		type: Array,
		default: []
	})
	public commands: AbstractCommand[] = [];

	async execute(): Promise<void> {
		if (this.commands.length) {
			await this.applyChildrenContext();
			const firstCommand = this.commands[0];
			await firstCommand.execute();
		}
		await super.execute();
	}

	private async applyChildrenContext() {
		const dataContextResolver = this.ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		const pageContextResolver = this.ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		dataContextResolver.copyCommandContext(this, this.commands);
		pageContextResolver.increaseCommandsContext(this, this.commands);
	}
}
