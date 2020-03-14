import { AbstractCommand } from '../../command/abstract-command';

export class ClickCommand extends AbstractCommand {
	execute(): Promise<void> {
		return undefined;
	}

}
