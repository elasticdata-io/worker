import { AbstractCommand } from '../../command/abstract-command';

export class GetUrlCommand extends AbstractCommand {

	async execute(): Promise<void> {
		const url = await this.driver.getCurrentUrl();
		console.log(url);
		super.execute();
	}
}
