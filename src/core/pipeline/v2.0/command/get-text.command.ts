import { AbstractCommand } from '../../command/abstract-command';
import { TYPES as ROOT_TYPES } from '../../types';
import { IBrowserProvider } from '../../browser/i-browser-provider';

export class GetTextCommand extends AbstractCommand {

	public key?: string;
	public keyCommand?: AbstractCommand;
	public attribute: string;

	async execute(): Promise<void> {
		let text;
		if (this.attribute) {
			text = await this.driver.getElAttribute(this, this.attribute);
		} else {
			text = await this.driver.getElText(this);
		}
		const key = await this.getKey();
		await this.store.put(key, text, this);
		await super.execute();
	}

	public async getKey(): Promise<string> {
		if (this.key) {
			return this.key;
		}
		if (this.keyCommand) {
			const provider = this.ioc.get<IBrowserProvider>(ROOT_TYPES.IBrowserProvider);
			await provider.execute(this.keyCommand)
			const key = await this.keyCommand.getKey()
			const keyValue = await this.store.get(key, this.keyCommand);
			await this.store.remove(key, this.keyCommand);
			return keyValue;
		}
		return this.uuid;
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}
}
