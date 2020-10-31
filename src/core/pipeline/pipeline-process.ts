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
import {EventBus, PipelineCommandEvent, UserInteractionEvent} from "./event-bus";
import {PipelineEvent} from "./event-bus/events/pipeline";
import {TaskCommandExecuteDto} from "../../dto/task.command.execute.dto";
import {Subject} from "rxjs";
import {ExecuteCmdDto} from "../../dto/execute-cmd.dto";
import {UserInteractionState} from "./user-interaction";

export class PipelineProcess {
	private _commandAnalyzer: AbstractCommandAnalyzer;
	public eventBus: EventBus;
	protected browser: AbstractBrowser;
	protected store: AbstractStore;

	public isAborted = false;
	public startExecuteCommand$: Subject<TaskCommandExecuteDto> = new Subject();
	public interactionStateChanged$: Subject<UserInteractionState> = new Subject();

	constructor(private _commandsJson: string,
				private _commands: AbstractCommand[],
				private _dataRules: Array<DataRule>,
				private _browserProvider: BrowserProvider,
				private _ioc: PipelineIoc) {
		this.store = this._ioc.get<AbstractStore>(TYPES.AbstractStore);
		this.browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
		this.eventBus = this._ioc.get<EventBus>(TYPES.EventBus);
	}

	private async _saveTaskInformation(error?: any): Promise<TaskInformation> {
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

	private _subscribeEvents() {
		this.eventBus.on(PipelineCommandEvent.START_EXECUTE_COMMAND, async (command: TaskCommandExecuteDto) => {
			this.startExecuteCommand$.next(command);
		});
		this.eventBus.on(UserInteractionEvent.UPDATE_USER_INTERACTION_MODE, async (state: UserInteractionState) => {
			this.interactionStateChanged$.next(state);
		});
	}

	private _unsubscribeEvents() {
		this.eventBus.clearListeners();
	}

	public async run(): Promise<TaskInformation> {
		this._subscribeEvents();
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

	public async commit(): Promise<TaskResult> {
		return this.store.commit();
	}

	public async abort(): Promise<TaskInformation> {
		await this.browser.abort();
		this.isAborted = true;
		return await this._saveTaskInformation();
	}

	public async destroy(): Promise<void> {
		try {
			await this.eventBus.emit(PipelineEvent.BEFORE_DESTROY_PIPELINE);
			await this.browser.destroy();
			this._ioc.unbindAll();
		} catch (e) {
			console.error(e);
		} finally {
			this._unsubscribeEvents();
		}
	}
}
