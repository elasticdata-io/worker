import { AbstractCommand } from '../../command/abstract-command';

/**
 * Open new tab with old browser session.
 */
export class OpenTabCommand extends AbstractCommand {

	public timeout = 2;
	public commands: AbstractCommand[] = [];

	async execute(): Promise<void> {
		// await this.driver.goToUrl(this, link, this.timeout);
		await super.execute();
	}
}
