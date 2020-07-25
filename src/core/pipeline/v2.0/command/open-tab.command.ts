import { AbstractCommand } from '../../command/abstract-command';
import {Cmd} from "../../command/decorator/command.decorator";
import {CommandType} from "../../documentation/specification";
import {Assignable} from "../../command/decorator/assignable.decorator";
import {DataContextResolver} from "../../data/data-context-resolver";
import {TYPES as ROOT_TYPES} from "../../types";
import {PageContextResolver} from "../../browser/page-context-resolver";
import { LineMacrosParser } from '../../data/line-macros-parser';

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
	public commands: AbstractCommand[] = [];

	private async _goToUrl(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
	}

	private async _getLink(): Promise<string> {
		// todo: two requests to data service: for command and command analyzer
		return await this.replaceMacros(this.link, this);
	}

	private async _executeCommands(): Promise<void> {
		if (this.commands.length) {
			const firstCommand = this.commands[0];
			await firstCommand.execute();
			// todo: new tab per opentab command
			console.log('INNER FINISHED');
		}
	}

	private async _setCommandsContext() {
		const dataContextResolver = this.ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		const pageContextResolver = this.ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		dataContextResolver.copyCommandContext(this, this.commands);
		await pageContextResolver.increaseContext(this);
	}

	private async _closePageContext() {
		await this.driver.closePageContext(this);
	}

	public async execute(): Promise<void> {
		await this._setCommandsContext();
		await this._goToUrl();
		await this._executeCommands();
		await this._closePageContext();
		await super.execute();
	}

	/**
	 * @override
	 */
	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = [
			...super.getManagedKeys(),
			'link',
		];
		if (LineMacrosParser.hasAnyMacros(this.link)) {
			keys.push({
				key: 'link_runtime',
				fn: this._getLink
			});
		}
		return keys;
	}
}
