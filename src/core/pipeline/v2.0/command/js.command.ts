import { AbstractCommand } from '../../command/abstract-command';
import { CmdProperty } from '../../command/decorator/command-property.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'js'})
export class JsCommand extends AbstractCommand {

	@CmdProperty()
	public key: string | AbstractCommand;

	@CmdProperty()
	public script: string;

	async execute(): Promise<void> {
		const result = await this.driver.executeScript(this, null);
		if (result !== undefined && result !== null) {
			const key = await this.getKey();
			await this.store.put(key, result, this);
		}
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key', 'script']);
	}
}
