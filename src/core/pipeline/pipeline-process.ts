import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { PipelineIoc } from './pipeline-ioc';
import { AbstractStore } from './data/abstract-store';
import { TYPES } from './types';
import { DataResult } from './data/dto/data.result';

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
		} catch (e) {
			throw e;
		} finally {
			await this.destroy();
		}
	}

	async commit(): Promise<DataResult> {
		return this.store.commit();
	}

	async stop(): Promise<void> {
		// todo: need implement
		this.destroy();
	}

	async destroy(): Promise<void> {
		// todo: need implement
		this._ioc.unbindAll();
	}
}
