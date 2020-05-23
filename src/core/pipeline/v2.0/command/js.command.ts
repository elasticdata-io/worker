import { AbstractCommand } from '../../command/abstract-command';

export class JsCommand extends AbstractCommand {

	key: string;
	script: string;

	async execute(): Promise<void> {
		const result = await this.driver.executeScript(this.script, null);
		if (result !== undefined && result !== null) {
			const key = await this.getKey();
			await this.store.put(key, result, this);
		}
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'script']);
	}
}
