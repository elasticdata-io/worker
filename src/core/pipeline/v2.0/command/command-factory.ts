import { GetTextCommand } from './get-text.command';
import { AbstractCommand } from '../../command/abstract-command';
import { ICommandFactory } from '../../command/i-command-factory';
import { ClickCommand } from './click.command';
import { CheckDataCommand } from './check-data.command';
import { ConditionCommand } from './condition.command';
import { GetHtmlCommand } from './get-html.command';
import { GetScreenshotCommand } from './get-screenshot.command';
import { GetUrlCommand } from './get-url.command';
import { HoverCommand } from './hover.command';
import { ImportCommand } from './import.command';
import { JsCommand } from './js.command';
import { LoopCommand } from './loop.command';
import { NativeClickCommand } from './native-click.command';
import { PauseCommand } from './pause.command';
import { PutTextCommand } from './put-text.command';
import { ReplaceTextCommand } from './replace-text.command';
import { ScrollToCommand } from './scroll-to.command';
import { OpenUrlCommand } from './open-url.command';
import { WaitElementCommand } from './wait-element.command';
import { PipelineIoc } from '../../pipeline-ioc';
import { inject } from 'inversify';
import { CommandFactoryIoc } from './command-factory-ioc';
import { TYPES } from './types';
import { TYPES as ROOT_TYPES } from '../../types';

export class CommandFactory extends ICommandFactory {
	constructor(@inject(ROOT_TYPES.PipelineIoc) private _pipelineIoc: PipelineIoc) {
		super();
		CommandFactoryIoc.registerCommands(this._pipelineIoc);
	}

	createChainCommands(commandsJson: string): AbstractCommand[] {
		const commands = this.getCommands(commandsJson);
		this.linksCommands(commands);
		return commands;
	}

	private linksCommands(commands: AbstractCommand[]) {
		commands.forEach((command, index) => {
			const nextCommand = commands[index + 1];
			if (nextCommand) {
				command.setNextCommand(nextCommand);
			}
		});
	}

	private getCommands(commandsJson: string) {
		const commands = JSON.parse(commandsJson) || [];
		return commands.map(config => {
			const cmd = config.cmd;
			delete config.cmd;
			let command: AbstractCommand = null;
			switch (cmd.toLocaleLowerCase()) {
				case 'gettext':
					command = this._pipelineIoc.get<GetTextCommand>(TYPES.GetTextCommand);
					break;
				case 'click':
					command = this._pipelineIoc.get<ClickCommand>(TYPES.ClickCommand);
					break;
				case 'checkdata':
					command = this._pipelineIoc.get<CheckDataCommand>(TYPES.CheckDataCommand);
					break;
				case 'condition':
					command = this._pipelineIoc.get<ConditionCommand>(TYPES.ConditionCommand);
					break;
				case 'gethtml':
					command = this._pipelineIoc.get<GetHtmlCommand>(TYPES.GetHtmlCommand);
					break;
				case 'getscreenshot':
					command = this._pipelineIoc.get<GetScreenshotCommand>(TYPES.GetScreenshotCommand);
					break;
				case 'geturl':
					command = this._pipelineIoc.get<GetUrlCommand>(TYPES.GetUrlCommand);
					break;
				case 'hover':
					command = this._pipelineIoc.get<HoverCommand>(TYPES.HoverCommand);
					break;
				case 'import':
					command = this._pipelineIoc.get<ImportCommand>(TYPES.ImportCommand);
					break;
				case 'js':
					command = this._pipelineIoc.get<JsCommand>(TYPES.JsCommand);
					break;
				case 'loop':
					command = this._pipelineIoc.get<LoopCommand>(TYPES.LoopCommand);
					break;
				case 'nativeclick':
					command = this._pipelineIoc.get<NativeClickCommand>(TYPES.NativeClickCommand);
					break;
				case 'pause':
					command = this._pipelineIoc.get<PauseCommand>(TYPES.PauseCommand);
					break;
				case 'puttext':
					command = this._pipelineIoc.get<PutTextCommand>(TYPES.PutTextCommand);
					break;
				case 'replacetext':
					command = this._pipelineIoc.get<ReplaceTextCommand>(TYPES.ReplaceTextCommand);
					break;
				case 'scrollto':
					command = this._pipelineIoc.get<ScrollToCommand>(TYPES.ScrollToCommand);
					break;
				case 'openurl':
					command = this._pipelineIoc.get<OpenUrlCommand>(TYPES.OpenUrlCommand);
					break;
				case 'waitelement':
					command = this._pipelineIoc.get<WaitElementCommand>(TYPES.WaitElementCommand);
					break;
				default:
					throw new Error(`command: ${cmd} not supported`)
			}
			if (command) {
				for(const [key, value] of Object.entries(config)) {
					command[key] = value;
				}
			}
			return command;
		});
	}
}
