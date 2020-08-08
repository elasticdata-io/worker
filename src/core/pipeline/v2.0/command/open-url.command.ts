import { AbstractCommand } from '../../command/abstract-command';
import { IBrowserProvider } from '../../browser/i-browser-provider';
import { TYPES as ROOT_TYPES } from '../../types';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';
import { LineMacrosParser } from '../../data/line-macros-parser';

@Cmd({
	cmd: 'openurl',
	version: '2.0',
	summary: 'Go to url page',
	type: CommandType.ACTION,
})
export class OpenUrlCommand extends AbstractCommand {

	private _linkCommand: AbstractCommand;

	@Assignable({required: false, type: Number, default: 30})
	public timeout = 30;

	@Assignable({
		type: [String, AbstractCommand],
		default: '',
	})
	public link: string | AbstractCommand = '';

	public set linkCommand (command: AbstractCommand) {
		this._linkCommand = command;
	}

	async execute(): Promise<void> {
		const link = await this._getLink();
		await this.driver.goToUrl(this, link, this.timeout);
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
		if (typeof this.link === 'string') {
			if (LineMacrosParser.hasAnyMacros(this.link)) {
				keys.push({
					key: 'link_runtime',
					fn: this._getLink
				});
			}
		} else if (typeof this.link === 'object') {
			keys.push({
				key: 'link_runtime',
				fn: this._getLink
			});
		}
		return keys;
	}


	private async _getLink(): Promise<string> {
		if (typeof this.link === 'string') {
			return await this.replaceMacros(this.link, this);
		}
		const linkCommand = this._linkCommand;
		if (linkCommand) {
			const provider = this.ioc.get<IBrowserProvider>(ROOT_TYPES.IBrowserProvider);
			await provider.execute(linkCommand, {silent: true, context: this});
			const key = await linkCommand.getKey()
			const keyValue = await this.store.get(key, linkCommand);
			if (key.startsWith('tmp_')) {
				await this.store.remove(key, linkCommand);
			}
			return keyValue;
		}
	}
}
