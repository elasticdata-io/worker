import { AbstractCommand } from '../../command/abstract-command';
import {Cmd} from "../../command/decorator/command.decorator";
import {CommandType} from "../../documentation/specification";
import {Assignable} from "../../command/decorator/assignable.decorator";
import { TYPES as ROOT_TYPES } from "../../types";
import { LineMacrosParser } from '../../data/line-macros-parser';
import {CommandFactory} from "./command-factory";
import {StringGenerator} from "../../util/string.generator";

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

	private async _goToUrl(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
	}

	private async _getLink(): Promise<string> {
		// todo: two requests to data service: for command and command analyzer
		return await this.replaceMacros(this.link, this);
	}

	private async _executeCommands(commands: AbstractCommand[]): Promise<void> {
		if (commands.length) {
			const pageContext = this.pageContextResolver.resolvePageContext(this);
			const dataContext = this.contextResolver.resolveContext(this);
			commands.forEach(command => {
				this.contextResolver.setContext(command, dataContext);
			});
			this.pageContextResolver.setPageContext(commands, pageContext);
			await commands[0].execute();
		}
	}

	private async _releasePageContext(pageContext: number) {
		await this.driver.releasePageContext(pageContext);
	}

	private async _execute(pageContext: number, dataContext: string): Promise<void> {
		const commandFactory = this.ioc.get<CommandFactory>(ROOT_TYPES.ICommandFactory);
		const commands = commandFactory.createChainCommands(this.commands);
		this._goToUrl()
			.then(() => this._executeCommands(commands))
			.then(() => super.execute())
			.then(() => console.log(`FINISH pageContext: ${pageContext}, dataContext: ${dataContext}`))
			.catch((error) => console.error(error))
			.finally(() => this._releasePageContext(pageContext))
	}

	/**
	 * Create new opentab command with inner commands.
	 * OpenTab command running in async mode and not block main tab thread
	 */
	public async execute(): Promise<void> {
		const commandsJSON = JSON.stringify(this.commands);
		const openTabCommand = new OpenTabCommand(this.ioc);
		openTabCommand.commands = commandsJSON;
		openTabCommand.link = this.link;
		openTabCommand.timeout = this.timeout;
		openTabCommand.uuid = StringGenerator.generate();
		this.pageContextResolver.increaseContext(openTabCommand);
		this.contextResolver.copyCommandContext(this, [openTabCommand]);
		const pageContext = this.pageContextResolver.resolvePageContext(openTabCommand);
		const dataContext = this.contextResolver.resolveContext(openTabCommand);
		this._execute.apply(openTabCommand, [pageContext, dataContext]);
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
