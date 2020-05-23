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
import { TYPES as ROOT_TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { CaptureSnapshotCommand } from './capture-snapshot.command';
import { StringGenerator } from '../../util/string.generator';
import { SystemError } from '../../command/exception/system-error';

export class CommandFactory extends ICommandFactory {
	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc,
				@inject(ROOT_TYPES.DataContextResolver) private _contextResolver: DataContextResolver) {
		super();
	}

	public appendUuidToCommands(commandsJson: string): string {
		return commandsJson.replace(/"cmd":\s?("[a-z]+")/ig, function (match) {
			return `"uuid": "${StringGenerator.generate()}", ${match}`;
		});
	}

	public createChainCommands(commandsJson: string): AbstractCommand[] {
		const commands = this._createCommands(commandsJson);
		this._linksCommands(commands);
		this._initDataContext(commands);
		return commands;
	}

	private _linksCommands(commands: AbstractCommand[]) {
		commands.forEach((command, index) => {
			const nextCommand = commands[index + 1];
			if (nextCommand) {
				command.setNextCommand(nextCommand);
			}
		});
	}

	private _createCommands(commandsJson: string) {
		const commands = JSON.parse(commandsJson) || [];
		return commands.map(config => this._creteCommand(config));
	}

	private _creteCommand(config: any): AbstractCommand {
		const cmd = config.cmd;
		let command: AbstractCommand = null;
		const ioc = this._ioc;
		switch (cmd.toLocaleLowerCase()) {
			case 'gettext':
				command = new GetTextCommand(ioc);
				break;
			case 'click':
				command = new ClickCommand(ioc);
				break;
			case 'checkdata':
				command = new CheckDataCommand(ioc);
				break;
			case 'condition':
				command = new ConditionCommand(ioc);
				break;
			case 'gethtml':
				command = new GetHtmlCommand(ioc);
				break;
			case 'getscreenshot':
				command = new GetScreenshotCommand(ioc);
				break;
			case 'geturl':
				command = new GetUrlCommand(ioc);
				break;
			case 'hover':
				command = new HoverCommand(ioc);
				break;
			case 'import':
				command = new ImportCommand(ioc);
				break;
			case 'js':
				command = new JsCommand(ioc);
				break;
			case 'loop':
				const loop = new LoopCommand(ioc);
				const commandsJson = JSON.stringify(config.commands);
				loop.commands = this.createChainCommands(commandsJson);
				command = loop;
				break;
			case 'nativeclick':
				command = new NativeClickCommand(ioc);
				break;
			case 'pause':
				command = new PauseCommand(ioc);
				break;
			case 'puttext':
				command = new PutTextCommand(ioc);
				break;
			case 'replacetext':
				command = new ReplaceTextCommand(ioc);
				break;
			case 'scrollto':
				command = new ScrollToCommand(ioc);
				break;
			case 'openurl':
				command = new OpenUrlCommand(ioc);
				break;
			case 'waitelement':
				command = new WaitElementCommand(ioc);
				break;
			case 'snapshot':
				command = new CaptureSnapshotCommand(ioc);
				break;
			default:
				throw new Error(`command: ${cmd} not supported`)
		}
		if (command) {
			for(const [key, value] of Object.entries(config)) {
				const ignoreKeys = key === 'commands'
				  || key === 'condition'
				  || key === 'truecommands'
				  || key === 'falsecommands';
				if (!ignoreKeys) {
					if (!(key in command)) {
						console.log(Object.getOwnPropertyNames(command))
						throw new SystemError(`command: ${config.cmd} not supporting property: ${key}`)
					}
					command[key] = value;
				}
			}
		}
		this._buildInnerKeyCommand(command);
		this._buildLinkCommand(command)
		return command;
	}

	private _buildInnerKeyCommand(command: any): void {
		const key = command.key;
		if (typeof key === 'object') {
			const innerCommand = this._creteCommand(key);
			this._contextResolver.setRootContext(innerCommand)
			command.setKeyCommand(innerCommand)
		}
	}

	private _buildLinkCommand(command: AbstractCommand): void {
		if (command instanceof OpenUrlCommand) {
			if (typeof command.link === 'object') {
				const innerCommand = this._creteCommand(command.link);
				this._contextResolver.setRootContext(innerCommand)
				command.linkCommand = innerCommand
			}
		}
	}

	private _initDataContext(commands: AbstractCommand[]) {
		commands
		  .forEach(command => this._contextResolver.setRootContext(command));
	}
}
