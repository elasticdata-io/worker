import { AbstractCommand } from '../../command/abstract-command';

export class GetHtmlCommand extends AbstractCommand {
	public key: string;

	async execute(): Promise<void> {
		const html = await this.driver.getElHtml(this);
		await this.store.put(this.key, html, this);
		await super.execute();
	}
}
