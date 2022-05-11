import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'getscreenshot',
	version: '2.0',
	type: CommandType.SELECTABLE,
	summary: `doc.GETSCREENSHOT.SUMMARY`,
})
export class GetScreenshotCommand extends AbstractCommand {

	@Assignable({
		required: false,
		type: [String, AbstractCommand],
		default: '',
	})
	public key: string | AbstractCommand = '';

	async execute(): Promise<void> {
		const buffer = await this.driver.getScreenshot(this);
		const key = await this.getKey();
		const pngFileLink = await this.store.attachWebpFile(buffer, this);
		await this.store.put(key, pngFileLink, this);
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'selector']);
	}
}
