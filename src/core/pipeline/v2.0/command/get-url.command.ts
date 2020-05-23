import { AbstractCommand } from '../../command/abstract-command';

export class GetUrlCommand extends AbstractCommand {

	public key: string | AbstractCommand;

	async execute(): Promise<void> {
		const url = await this.driver.getCurrentUrl();
		const key = await this.getKey();
		await this.store.put(key, url, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key']);
	}
}
