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
import { Injectable } from '@nestjs/common';
import { IBrowserProvider } from '../../browser/i-browser-provider';

@Injectable()
export class CommandFactory extends ICommandFactory {
	constructor(private _browserProvider: IBrowserProvider) {
		super();
	}

	createCommands(commandsJson: string): AbstractCommand[] {
		const commands = JSON.parse(commandsJson) || [];
		return commands.map(config => {
			const cmd = config.cmd;
			delete config.cmd;
			let command: AbstractCommand = null;
			switch (cmd.toLocaleLowerCase()) {
				case 'gettext':
					command = new GetTextCommand;
					break;
				case 'click':
					command = new ClickCommand;
					break;
				case 'checkdata':
					command = new CheckDataCommand;
					break;
				case 'condition':
					command = new ConditionCommand;
					break;
				case 'gethtml':
					command = new GetHtmlCommand;
					break;
				case 'getscreenshot':
					command = new GetScreenshotCommand;
					break;
				case 'geturl':
					command = new GetUrlCommand;
					break;
				case 'hover':
					command = new HoverCommand;
					break;
				case 'import':
					command = new ImportCommand;
					break;
				case 'js':
					command = new JsCommand;
					break;
				case 'loop':
					command = new LoopCommand;
					break;
				case 'nativeclick':
					command = new NativeClickCommand;
					break;
				case 'pause':
					command = new PauseCommand;
					break;
				case 'puttext':
					command = new PutTextCommand;
					break;
				case 'replacetext':
					command = new ReplaceTextCommand;
					break;
				case 'scrollto':
					command = new ScrollToCommand;
					break;
				case 'openurl':
					command = new OpenUrlCommand;
					break;
				case 'waitelement':
					command = new WaitElementCommand;
					break;
				default:
					throw new Error(`command: ${cmd} not supported`)
			}
			if (command) {
				command.setDependencies(this._browserProvider);
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
