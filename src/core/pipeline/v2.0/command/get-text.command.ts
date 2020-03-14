import { AbstractCommand } from '../../command/abstract-command';

export class GetTextCommand extends AbstractCommand {
	execute(): Promise<void> {
		return Promise.resolve();
	}
}
