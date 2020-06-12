import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'getscreenshot'})
export class GetScreenshotCommand extends AbstractCommand {

	@Assignable({required: false})
	public key: string | AbstractCommand = '';

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
