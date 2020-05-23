import { AbstractCommand } from '../../command/abstract-command';

export class PutTextCommand extends AbstractCommand {

	public text = '';

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.setElValue(this, this.text);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector', 'text']);
	}
}
