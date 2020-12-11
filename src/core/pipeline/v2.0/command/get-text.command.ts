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
	public timeout = 7;

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

	@Assignable({
		required: false,
		type: Boolean,
		default: true
	})
	public must = true;

	async execute(): Promise<void> {
		let text = '';
		try {
			await this.driver.waitElement(this);
			text = await this._getText();
		} catch (e) {
			if (this.must) {
				throw e;
			}
		}
		const key = await this.getKey();
		const value = `${this.prefix}${text}${this.suffix}`;
		if (text !== '') {
			await this.store.put(key, value, this);
		}
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}

	private async _getText(): Promise<string> {
		if (this.attribute) {
			return await this.driver.getElAttribute(this, this.attribute);
		} else {
			return await this.driver.getElText(this);
		}
	}
}
