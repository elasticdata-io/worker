import { AbstractCommand } from '../../command/abstract-command';

export class ImportCommand extends AbstractCommand {

	array: any[] = [];

	async execute(): Promise<void> {
		const data = this.array;
		await this.store.putAll(data, this);
		await super.execute();
	}
}
