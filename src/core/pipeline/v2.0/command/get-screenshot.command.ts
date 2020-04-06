import { AbstractCommand } from '../../command/abstract-command';

export class GetScreenshotCommand extends AbstractCommand {

	public key: string;

	async execute(): Promise<void> {
		const buffer = await this.driver.getScreenshot(this);
		await this.store.putFile(this.key, buffer, 'png', this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
