import { AbstractCommand } from '../../command/abstract-command';

export class PutTextCommand extends AbstractCommand {

	text: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.setElValue(this, this.text);
		await super.execute();
	}
}
