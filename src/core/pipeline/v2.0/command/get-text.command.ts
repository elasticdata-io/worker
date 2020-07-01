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

	@Assignable({required: false, type: Number})
	public timeout = 3;

	@Assignable({required: false, type: [String, AbstractCommand]})
	public key: string | AbstractCommand = '';

	@Assignable({type: String})
	public selector: string;

	@Assignable({required: false, type: String})
	public attribute = '';

	async execute(): Promise<void> {
		let text;
		if (this.attribute) {
			text = await this.driver.getElAttribute(this, this.attribute);
		} else {
			text = await this.driver.getElText(this);
		}
		const key = await this.getKey();
		await this.store.put(key, text, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}
}
