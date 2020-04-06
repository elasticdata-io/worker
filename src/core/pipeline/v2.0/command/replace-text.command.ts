import { AbstractCommand } from '../../command/abstract-command';

export class ReplaceTextCommand extends AbstractCommand {

	text: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		// todo: replaced text logic
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector', 'text']);
	}
}
