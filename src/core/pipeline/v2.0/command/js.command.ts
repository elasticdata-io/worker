import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'js',
	version: '2.0',
	type: CommandType.OTHER,
})
export class JsCommand extends AbstractCommand {

	@Assignable({required: false, type: Number})
	public timeout = 3;

	@Assignable({required: false, type: [String, AbstractCommand]})
	public key: string | AbstractCommand;

	@Assignable({type: String})
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
