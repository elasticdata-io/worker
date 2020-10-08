import {inject, injectable} from "inversify";
import { UserInteractionSettingsConfiguration } from "../configuration/settings-configuration";
import {AbstractCommand} from "../command/abstract-command";
import {TYPES, TYPES as ROOT_TYPES} from "../types";
import {PipelineIoc} from "../pipeline-ioc";
import {ICommandFactory} from "../command/i-command-factory";
import {IBrowserProvider} from "../browser/i-browser-provider";

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

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {}

	private async _commandExecutingSuccessful(command: AbstractCommand, context: AbstractCommand): Promise<boolean> {
		try {
			await this.browserProvider.execute(command, {context: context, silent: true});
			return true;
		} catch (e) {
			return false;
		}
	}

	public async checkNeedInteractionAfterCommand(command: AbstractCommand): Promise<boolean> {
		for (const needWatchCommand of this.needWatchCommands) {
			const successful = await this._commandExecutingSuccessful(needWatchCommand, command);
			console.log(`command: ${command.cmd}, successful - ${successful}`);
			if (successful) {
				return true;
			}
		}
		return false;
	}

	public async waitUserConfirmationAfterCommand(command: AbstractCommand): Promise<void> {
		console.log('waitUserConfirmationAfterCommand');
		return new Promise(function(resolve) {
			setTimeout(resolve, 10 * 1000);
		});
	}
}
