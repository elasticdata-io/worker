import { AbstractCommand } from '../../command/abstract-command';

/**
 * Open new window with new browser session.
 */
export class OpenWindowCommand extends AbstractCommand {

	public timeout = 2;
	public commands: AbstractCommand[] = [];

	async execute(): Promise<void> {
		// await this.driver.goToUrl(this, link, this.timeout);
		await super.execute();
	}
}
