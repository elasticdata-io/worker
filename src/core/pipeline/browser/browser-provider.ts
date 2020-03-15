import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';

export class BrowserProvider extends IBrowserProvider {
	execute(command: AbstractCommand): Promise<void> {
		return command.execute();
	}
}
