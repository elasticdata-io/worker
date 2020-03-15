import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';

export class BrowserProvider extends IBrowserProvider {
	async execute(command: AbstractCommand): Promise<void> {
		return await command.execute();
	}
}
