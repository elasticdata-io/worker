import { AbstractCommand } from '../../command/abstract-command';

export class GetUrlCommand extends AbstractCommand {

	public key: string;

	async execute(): Promise<void> {
		const url = await this.driver.getCurrentUrl();
		console.log(url);
		await super.execute();
	}
}
