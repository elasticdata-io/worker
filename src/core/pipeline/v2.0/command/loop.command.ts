import { AbstractCommand } from '../../command/abstract-command';

export class LoopCommand extends AbstractCommand {
	execute(): Promise<void> {
		return undefined;
	}

}
