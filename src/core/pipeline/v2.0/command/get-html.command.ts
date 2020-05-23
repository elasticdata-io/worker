import { AbstractCommand } from '../../command/abstract-command';

export class GetHtmlCommand extends AbstractCommand {
	public key: string;

	async execute(): Promise<void> {
		const html = await this.driver.getElHtml(this);
		const key = await this.getKey();
		await this.store.put(key, html, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
