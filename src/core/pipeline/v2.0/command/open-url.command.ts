import { AbstractCommand } from '../../command/abstract-command';

export class OpenUrlCommand extends AbstractCommand {

	public link: string;

	async execute(): Promise<void> {
		await this.driver.goToUrl(this.link);
		await super.execute();
	}
}
