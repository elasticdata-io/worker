import { AbstractCommand } from '../../command/abstract-command';

export class PauseCommand extends AbstractCommand {
	execute(): Promise<void> {
		return undefined;
	}

}
