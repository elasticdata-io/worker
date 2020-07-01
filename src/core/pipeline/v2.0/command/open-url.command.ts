import { AbstractCommand } from '../../command/abstract-command';
import { IBrowserProvider } from '../../browser/i-browser-provider';
import { TYPES as ROOT_TYPES } from '../../types';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'openurl',
	version: '2.0',
	summary: 'Go to url page',
	type: CommandType.ACTION,
})
export class OpenUrlCommand extends AbstractCommand {

	private _linkCommand: AbstractCommand;

	@Assignable({required: false, type: Number})
	public timeout = 30;

	@Assignable({type: [String, AbstractCommand]})
	public link: string | AbstractCommand = '';

	public set linkCommand (command: AbstractCommand) {
		this._linkCommand = command;
	}

	async execute(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['link']);
	}

	private async _getLink(): Promise<string> {
		if (typeof this.link === 'string') {
			return this.link;
		}
		const linkCommand = this._linkCommand;
		if (linkCommand) {
			const provider = this.ioc.get<IBrowserProvider>(ROOT_TYPES.IBrowserProvider);
			await provider.execute(linkCommand, {silent: true, context: this});
			const key = await linkCommand.getKey()
			const keyValue = await this.store.get(key, linkCommand);
			await this.store.remove(key, linkCommand);
			return keyValue;
		}
	}
}
