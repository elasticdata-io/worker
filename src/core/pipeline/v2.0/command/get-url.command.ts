import { AbstractCommand } from '../../command/abstract-command';

export class GetUrlCommand extends AbstractCommand {

	public key: string;

	async execute(): Promise<void> {
		const url = await this.driver.getCurrentUrl();
		await this.store.put(this.key, url, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key']);
	}
}
