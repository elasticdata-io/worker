import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BrowserProvider extends IBrowserProvider {
	execute(command: AbstractCommand): Promise<void> {
		// todo: need implement
		return command.execute();
	}
}
