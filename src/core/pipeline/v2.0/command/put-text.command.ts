import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';

@Cmd({cmd: 'puttext', version: '2.0'})
export class PutTextCommand extends AbstractCommand {
	@Assignable()
	public text = '';

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.setElValue(this, this.text);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector', 'text']);
	}
}
