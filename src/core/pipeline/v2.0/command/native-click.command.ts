import { AbstractCommand } from '../../command/abstract-command';

export class NativeClickCommand extends AbstractCommand {
	execute(): Promise<void> {
		return undefined;
	}

}
