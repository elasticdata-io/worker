import { AbstractCommand } from '../../command/abstract-command';

export class PauseCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await this.driver.pause(this);
		await super.execute();
	}
}
