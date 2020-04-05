import { AbstractCommand } from '../../command/abstract-command';

export class CaptureSnapshotCommand extends AbstractCommand {

	public key: string;

	async execute(): Promise<void> {
		const captureSnapshot = await this.driver.captureSnapshot();
		await this.store.putFile(this.key, Buffer.from(captureSnapshot.toString()), 'mhtml', this);
		await super.execute();
	}
}
