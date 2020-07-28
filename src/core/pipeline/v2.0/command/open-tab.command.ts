import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from "../../command/decorator/command.decorator";
import { CommandType } from "../../documentation/specification";
import { Assignable } from "../../command/decorator/assignable.decorator";
import { CommandFactory } from './command-factory';
import { TYPES as ROOT_TYPES } from '../../types';

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
		default: 30
	})
	public timeout = 30;

	@Assignable({
		type: [String],
		default: '',
	})
	public link = '';

	@Assignable({
		required: true,
		type: Array,
		default: []
	})
	public commands: string;

	/**
	 * Create new opentab command with inner commands.
	 * OpenTab command running in async mode and not block main tab thread
	 */
	public async execute(): Promise<void> {
		const commandFactory = this.ioc.get<CommandFactory>(ROOT_TYPES.ICommandFactory);
		const pageContext = this.pageContextResolver.resolveContext(this);
		const dataContext = this.dataContextResolver.resolveContext(this);
		const openTabRuntimeCommand = commandFactory.createOpenTabRuntimeCommand({
			openTabCommand: this,
			dataContext: dataContext,
			pageContext: pageContext,
		})
		this.browserProvider
		  .execute(openTabRuntimeCommand)
		  .then(() => super.execute());
	}

	/**
	 * @override
	 */
	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		return [];
	}
}
