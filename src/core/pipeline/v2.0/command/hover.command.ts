import { AbstractCommand } from '../../command/abstract-command';

export class HoverCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		await this.driver.hover(this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector']);
	}
}
