import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { AbstractBrowser } from './browser/abstract-browser';

export class PipelineProcess {
	constructor(private _browser: AbstractBrowser,
				private _commands: AbstractCommand[],
				private _browserProvider: BrowserProvider) {}

	run(): void {
		// todo: need implement
		this._browser.create();
		try {
			if (this._commands.length === 0) {
				console.warn(`commands is empty list`);
				return;
			}
			const command = this._commands[0];
			console.log(command);
			this._browserProvider.execute(command);
			this.stop();
		} catch (e) {
			console.error(e);
		}
	}

	stop(): void {
		// todo: need implement
	}
}
