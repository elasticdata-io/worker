import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { PipelineIoc } from './pipeline-ioc';
import { AbstractStore } from './data/abstract-store';
import { TYPES } from './types';

export class PipelineProcess {

	protected store: AbstractStore;

	constructor(private _commands: AbstractCommand[],
				private _browserProvider: BrowserProvider,
				private _ioc: PipelineIoc) {
		this.store = this._ioc.get<AbstractStore>(TYPES.AbstractStore);
	}

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

	async getDocument(): Promise<any> {
		return this.store.getDocument();
	}

	async commit(): Promise<string> {
		return this.store.commit();
	}

	stop(): void {
		// todo: need implement
		this._ioc.unbindAll();
	}
}
