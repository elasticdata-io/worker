import { AbstractCommand } from '../../command/abstract-command';

export class GetTextCommand extends AbstractCommand {

	public key: string | AbstractCommand;
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

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}
}
