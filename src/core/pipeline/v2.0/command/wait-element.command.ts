import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'waitelement',
	version: '2.0',
	type: CommandType.OTHER,
})
export class WaitElementCommand extends AbstractCommand {

	@Assignable({required: false})
	public timeout = 5;

	@Assignable()
	public selector: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector']);
	}
}
