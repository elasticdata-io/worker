import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'click',
	version: '2.0',
	type: CommandType.ACTION,
})
export class ClickCommand extends AbstractCommand {

	@Assignable({required: false, type: Number})
	public timeout = 3;

	@Assignable({required: false, type: [String, AbstractCommand]})
	public key: string | AbstractCommand = '';

	@Assignable({type: String})
	public selector: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.domClick(this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector']);
	}
}
