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
	public commands: AbstractCommand[];
	public createCommandsFactory: () => AbstractCommand[];

	private async _goToUrl(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
	}

	private async _getLink(): Promise<string> {
		// todo: two requests to data service: for command and command analyzer
		return await this.replaceMacros(this.link, this);
	}

	private async _executeCommands(pageContext: number, dataContext: string): Promise<void> {
		try {
			const commands = this.createCommandsFactory();
			if (commands.length) {
				commands.forEach(command => this.contextResolver.setContext(command, dataContext));
				this.pageContextResolver.setPageContext(commands, pageContext);
				await commands[0].execute();
			}
		} finally {
			await this._releasePageContext(pageContext);
		}
	}

	private async _increasePageContext() {
		const pageContextResolver = this.ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		await pageContextResolver.increaseContext(this);
	}

	private async _releasePageContext(pageContext: number) {
		await this.driver.releasePageContext(pageContext);
	}

	public async execute(): Promise<void> {
		await this._increasePageContext();
		const pageContext = this.pageContextResolver.resolvePageContext(this);
		const dataContext = this.contextResolver.resolveContext(this)
		this._goToUrl()
			.then(() => this._executeCommands(pageContext, dataContext))
			.then(() => super.execute())
			.then(() => console.log(`FINISH pageContext: ${pageContext}, dataContext: ${dataContext}`))
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
