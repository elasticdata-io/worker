import { BrowserProvider } from './browser/browser-provider';
import { AbstractCommand } from './command/abstract-command';
import { PipelineIoc } from './pipeline-ioc';
import { AbstractStore } from './data/abstract-store';
import { TYPES } from './types';
import { TaskResult } from './data/dto/task.result';
import { AbstractBrowser } from './browser/abstract-browser';
import { AbstractCommandAnalyzer } from './analyzer/abstract.command.analyzer';
import { TaskInformation } from './analyzer/task.information';
import { DataRule } from './data/dto/data-rule';

export class PipelineProcess {

	protected browser: AbstractBrowser;
	protected store: AbstractStore;

	public isAborted = false;
	private _commandAnalyzer: AbstractCommandAnalyzer;

	constructor(private _commandsJson: string,
				private _commands: AbstractCommand[],
				private _dataRules: Array<DataRule>,
				private _browserProvider: BrowserProvider,
				private _ioc: PipelineIoc) {
		this.store = this._ioc.get<AbstractStore>(TYPES.AbstractStore);
		this.browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
	}

	async run(): Promise<TaskInformation> {
		if (this._commands.length === 0) {
			console.warn(`commands is empty list`);
			return;
		}
		const command = this._commands[0];
		try {
			await this.store.setDataRules(this._dataRules);
			await this._browserProvider.execute(command);
			await this._browserProvider.waitCompleted();
			return await this._saveTaskInformation();
		} catch (error) {
			console.error(error);
			if (this.isAborted) {
				return;
			}
			return await this._saveTaskInformation(error);
		} finally {
			await this.destroy();
		}
	}

	private async _saveTaskInformation(error?: any) {
		const command = this._commands[0];
		const commandsAnalyzed = await this._commandAnalyzer.getCommands();
		const taskCommandsInfo = {
			analyzed: commandsAnalyzed,
		};
		const file = await this.store.attachJsonFile(taskCommandsInfo, command);
		return {
			commandsInformationLink: file,
			failureReason: error ? error.toString(): null,
		};
	}

	async commit(): Promise<TaskResult> {
		return this.store.commit();
	}

	async abort(): Promise<TaskInformation> {
		await this.browser.abort();
		this.isAborted = true;
		return await this._saveTaskInformation();
	}

	async destroy(): Promise<void> {
		await this.browser.destroy();
		this._ioc.unbindAll();
	}
}
