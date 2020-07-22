import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'gettext',
	version: '2.0',
	type: CommandType.SELECTABLE,
})
export class GetTextCommand extends AbstractCommand {

	@Assignable({required: false, type: Number, default: 3})
	public timeout = 3;

	@Assignable({
		required: false,
		type: [String, AbstractCommand],
		default: '',
	})
	public key: string | AbstractCommand = '';

	@Assignable({type: String, default: undefined})
	public selector: string;

	@Assignable({required: false, type: String, default: ''})
	public attribute = '';

	@Assignable({
		required: false,
		type: String,
		default: ''
	})
	public suffix = '';

	@Assignable({
		required: false,
		type: String,
		default: ''
	})
	public prefix = '';

	async execute(): Promise<void> {
		let text;
		if (this.attribute) {
			text = await this.driver.getElAttribute(this, this.attribute);
		} else {
			text = await this.driver.getElText(this);
		}
		const key = await this.getKey();
		const value = `${this.prefix}${text}${this.suffix}`
		await this.store.put(key, value, this);
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}
}
