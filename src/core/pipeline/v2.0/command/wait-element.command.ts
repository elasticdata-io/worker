import { AbstractCommand } from '../../command/abstract-command';

export class WaitElementCommand extends AbstractCommand {
	execute(): Promise<void> {
		return undefined;
	}

}
