import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'hover', version: '2.0'})
export class HoverCommand extends AbstractCommand {

	@Assignable({required: false})
	public timeout = 3;

	@Assignable()
	public selector: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.hover(this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector']);
	}
}
