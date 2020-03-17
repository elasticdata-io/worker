import { AbstractCommand } from '../../command/abstract-command';

export class ImportCommand extends AbstractCommand {

	async execute(): Promise<void> {
		await super.execute();
	}
}
