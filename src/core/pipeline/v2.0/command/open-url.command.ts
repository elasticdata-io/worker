import { AbstractCommand } from '../../command/abstract-command';

export class OpenUrlCommand extends AbstractCommand {

	public timeout = 30;
	public link: string;

	async execute(): Promise<void> {
		await this.driver.goToUrl(this.link, this.timeout);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['link']);
	}
}
