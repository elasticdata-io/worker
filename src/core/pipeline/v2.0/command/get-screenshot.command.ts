import { AbstractCommand } from '../../command/abstract-command';

export class GetScreenshotCommand extends AbstractCommand {

	public key: string | AbstractCommand;

	async execute(): Promise<void> {
		const buffer = await this.driver.getScreenshot(this);
		const key = await this.getKey();
		await this.store.putFile(key, buffer, 'png', this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
