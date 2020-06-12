import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'geturl'})
export class GetUrlCommand extends AbstractCommand {

	@Assignable({required: false})
	public key: string | AbstractCommand = '';

	async execute(): Promise<void> {
		const url = await this.driver.getCurrentUrl(this);
		const key = await this.getKey();
		await this.store.put(key, url, this);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['key']);
	}
}
