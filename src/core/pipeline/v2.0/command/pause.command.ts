import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';

@Cmd({cmd: 'pause', version: '2.0'})
export class PauseCommand extends AbstractCommand {

	@Assignable({required: false})
	public timeout = 5;

	async execute(): Promise<void> {
		await this.driver.pause(this);
		await super.execute();
	}
}
