import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'snapshot',
	version: '2.0',
	type: CommandType.SELECTABLE,
	summary: `doc.SNAPSHOT.SUMMARY`,
})
export class CaptureSnapshotCommand extends AbstractCommand {

	@Assignable({required: false, type: String, default: ''})
	public key: string | AbstractCommand = '';

	async execute(): Promise<void> {
		const captureSnapshot = await this.driver.captureSnapshot(this);
		const key = await this.getKey();
		await this.store.putFile(key, Buffer.from(captureSnapshot.toString()), 'mhtml', this);
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['key']);
	}
}
