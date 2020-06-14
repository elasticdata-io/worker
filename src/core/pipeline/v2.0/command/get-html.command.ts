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

	@Assignable({required: false})
	public timeout = 3;

	@Assignable({required: false})
	public key: string | AbstractCommand = '';

	@Assignable()
	public selector: string;

	async execute(): Promise<void> {
		const html = await this.driver.getElHtml(this);
		const key = await this.getKey();
		await this.store.put(key, html, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
