import { AbstractCommand } from '../../command/abstract-command';

export class GetTextCommand extends AbstractCommand {

	public key: string;
	public attribute: string;

	async execute(): Promise<void> {
		let text;
		if (this.attribute) {
			text = await this.driver.getElAttribute(this, this.attribute);
		} else {
			text = await this.driver.getElText(this);
		}
		await this.store.put(this.key, text, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector', 'attribute']);
	}
}
