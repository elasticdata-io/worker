import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { PipelineIoc } from './pipeline-ioc';
import { AbstractStore } from './data/abstract-store';
import { TYPES } from './types';
import { DataResult } from './data/dto/data.result';
import { AbstractBrowser } from './browser/abstract-browser';
import { AbstractCommandAnalyzer } from './analyzer/abstract.command.analyzer';

export class PipelineProcess {

	protected browser: AbstractBrowser;
	protected store: AbstractStore;

	public isAborted = false;
	private _commandAnalyzer: AbstractCommandAnalyzer;

	constructor(private _commandsJson: string,
				private _commands: AbstractCommand[],
				private _browserProvider: BrowserProvider,
				private _ioc: PipelineIoc) {
		this.store = this._ioc.get<AbstractStore>(TYPES.AbstractStore);
		this.browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
	}

	async run(): Promise<void> {
		try {
			if (this._commands.length === 0) {
				console.warn(`commands is empty list`);
				return;
			}
			const command = this._commands[0];
			await this._browserProvider.execute(command);
			const commandsAnalyzed = await this._commandAnalyzer.getCommands();
			console.log(commandsAnalyzed, JSON.stringify(JSON.parse(this._commandsJson), null, ));
		} catch (e) {
			const commandsAnalyzed = await this._commandAnalyzer.getCommands();
			console.log(commandsAnalyzed);
			throw e;
		} finally {
			await this.destroy();
		}
	}

	async commit(): Promise<DataResult> {
		return this.store.commit();
	}

	async abort(): Promise<void> {
		this.destroy();
		this.isAborted = true;
	}

	async destroy(): Promise<void> {
		// todo: need implement
		await this.browser.stop();
		this._ioc.unbindAll();
	}
}
