import { AbstractCommand } from '../../command/abstract-command';

export class WaitElementCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await super.execute();
	}
}
