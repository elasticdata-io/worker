import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'snapshot'})
export class CaptureSnapshotCommand extends AbstractCommand {

	@Assignable({required: false})
	public key: string | AbstractCommand = '';

	async execute(): Promise<void> {
		const captureSnapshot = await this.driver.captureSnapshot(this);
		const key = await this.getKey();
		await this.store.putFile(key, Buffer.from(captureSnapshot.toString()), 'mhtml', this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key']);
	}
}
