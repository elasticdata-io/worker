import { AbstractCommand } from '../../command/abstract-command';

export class NativeClickCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await this.driver.nativeClick(this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['selector']);
	}
}
