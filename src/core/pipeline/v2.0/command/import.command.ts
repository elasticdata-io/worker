import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';

@Cmd({cmd: 'import'})
export class ImportCommand extends AbstractCommand {

	@Assignable()
	public array: any[] = [];

	async execute(): Promise<void> {
		const data = this.array;
		await this.store.putAll(data, this);
		await super.execute();
	}
}
