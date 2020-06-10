import { AbstractCommand } from '../../command/abstract-command';
import { CommandProperty } from '../../command/decorator/command-property.decorator';

export class JsCommand extends AbstractCommand {

	@CommandProperty()
	public key: string | AbstractCommand;

	@CommandProperty()
	public script: string;

	async execute(): Promise<void> {
		const result = await this.driver.executeScript(this, null);
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
