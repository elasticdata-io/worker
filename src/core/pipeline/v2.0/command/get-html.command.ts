import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'gethtml',
	version: '2.0',
	type: CommandType.SELECTABLE,
})
export class GetHtmlCommand extends AbstractCommand {

	@Assignable({required: false, type: Number, default: 3})
	public timeout = 7;

	@Assignable({
		required: false,
		type: [String, AbstractCommand],
		default: '',
	})
	public key: string | AbstractCommand = '';

	@Assignable({type: String, default: undefined})
	public selector: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		const html = await this.driver.getElHtml(this);
		const key = await this.getKey();
		await this.store.put(key, html, this);
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
