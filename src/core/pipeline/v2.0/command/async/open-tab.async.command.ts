import { AbstractCommand } from '../../../command/abstract-command';

export class OpenTabAsyncCommand extends AbstractCommand {

	public timeout = 30;
	public link = '';
	public commands: AbstractCommand[];

	private async _goToUrl(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
	}

	private async _getLink(): Promise<string> {
		// todo: two requests to data service: for command and command analyzer
		return await this.replaceMacros(this.link, this);
	}

	private async _executeCommands(): Promise<void> {
		const commands = this.commands;
		if (commands.length) {
			const firstCommand = commands[0];
			this.dataContextResolver.copyContext(this, commands);
			this.pageContextResolver.copyContext(this, commands);
			await this.browserProvider.execute(firstCommand);
		}
	}

	/**
	 * Create new opentab command with inner commands.
	 * OpenTab command running in async mode and not block main tab thread
	 */
	public async execute(): Promise<void> {
		await this._goToUrl();
		await this._executeCommands();
		await this._destroyPage();
		await super.execute();
	}

	private async _destroyPage() {
		const pageContext = this.pageContextResolver.resolveContext(this);
		await this.driver.destroyPage(pageContext);
	}

	/**
	 * @override
	 */
	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = [
			...super.getManagedKeys(),
			'link',
		];
		/*
		if (LineMacrosParser.hasAnyMacros(this.link)) {
			keys.push({
				key: 'link_runtime',
				fn: this._getLink
			});
		}
		*/
		return keys;
	}

	/**
	 * @override
	 */
	public setPageContext(pageContext: number) {
		this.pageContextResolver.setContext(this, pageContext);
		this.pageContextResolver.increaseContext(this);
		const increaseContext = this.pageContextResolver.resolveContext(this);
		this.commands.forEach(command => command.setPageContext(increaseContext))
	}

	/**
	 * @override
	 */
	public setDataContext(dataContext: string) {
		this.dataContextResolver.setContext(this, dataContext);
		this.commands.forEach(command => {
			this.dataContextResolver.setContext(command, dataContext);
		});
	}
}
