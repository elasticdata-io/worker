import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { PipelineIoc } from './pipeline-ioc';

export class PipelineProcess {
	constructor(private _commands: AbstractCommand[],
				private _browserProvider: BrowserProvider,
				private _pipelineIoc: PipelineIoc) {}

	async run(): Promise<void> {
		try {
			if (this._commands.length === 0) {
				console.warn(`commands is empty list`);
				return;
			}
			const command = this._commands[0];
			await this._browserProvider.execute(command);
			this.stop();
		} catch (e) {
			console.error(e);
		}
	}

	stop(): void {
		// todo: need implement
		this._pipelineIoc.unbindAll();
	}
}
