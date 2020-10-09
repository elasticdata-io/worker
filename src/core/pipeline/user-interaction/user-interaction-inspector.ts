import {inject, injectable} from "inversify";
import { UserInteractionSettingsConfiguration } from "../configuration/settings-configuration";
import {AbstractCommand} from "../command/abstract-command";
import {TYPES, TYPES as ROOT_TYPES} from "../types";
import {PipelineIoc} from "../pipeline-ioc";
import {ICommandFactory} from "../command/i-command-factory";
import {IBrowserProvider} from "../browser/i-browser-provider";
import {eventBus, PipelineCommandEvent} from "../event-bus";

@injectable()
export class UserInteractionInspector {

	private _needWatchCommands: AbstractCommand[] = [];
	public userInteraction: UserInteractionSettingsConfiguration;

	private get needWatchCommands(): AbstractCommand[] {
		const userInteraction = this.userInteraction;
		if (!userInteraction || !userInteraction.watchCommands) {
			return this._needWatchCommands;
		}
		if (!this._needWatchCommands || this._needWatchCommands.length === 0) {
			const watchCommandsJson = JSON.stringify(userInteraction.watchCommands);
			this._needWatchCommands = this.commandFactory.createCommands(watchCommandsJson);
		}
		return this._needWatchCommands;
	}

	private get commandFactory(): ICommandFactory {
		return this._ioc.get<ICommandFactory>(TYPES.ICommandFactory);
	}
	private get browserProvider(): IBrowserProvider {
		return this._ioc.get<IBrowserProvider>(TYPES.IBrowserProvider);
	}

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		this._initListeners();
	}

	private _initListeners() {
		eventBus
			.on(PipelineCommandEvent.BEFORE_EXECUTE_NEXT_COMMAND, this.onBeforeExecuteNextCommand.bind(this));
	}

	private async onBeforeExecuteNextCommand(command: AbstractCommand): Promise<void> {
		const needInteraction = await this.checkNeedInteractionMode(command);
		if (needInteraction) {
			await this.enableUserInteractionMode(command);
		}
	}

	private async _executeWatchCommand(command: AbstractCommand, context: AbstractCommand): Promise<boolean> {
		try {
			await this.browserProvider.execute(command, {inPageContext: context, silent: true});
		} catch (e) {
			return false;
		}
		return true;
	}

	public async checkNeedInteractionMode(executedCommand: AbstractCommand): Promise<boolean> {
		for (const needWatchCommand of this.needWatchCommands) {
			const successful = await this._executeWatchCommand(needWatchCommand, executedCommand);
			if (successful) {
				return true;
			}
		}
		return false;
	}

	public async enableUserInteractionMode(command: AbstractCommand): Promise<void> {
		console.log('WAIT_USER_CONFIRMATION_AFTER_COMMAND...');
		return new Promise(function(resolve) {
			setTimeout(resolve, 10 * 1000);
		});
	}
}
