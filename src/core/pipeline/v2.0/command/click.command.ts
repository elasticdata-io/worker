import { AbstractCommand } from '../../command/abstract-command';

export class ClickCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await this.driver.domClick(this);
		await super.execute();
	}
}
