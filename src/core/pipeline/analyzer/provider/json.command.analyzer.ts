import { AbstractCommandAnalyzer } from '../abstract.command.analyzer';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { CommandInformation } from '../command.information';
import moment = require('moment');
import { TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { PageContextResolver } from '../../browser/page-context-resolver';
import { OpenTabCommand } from '../../v2.0/command/open-tab.command';

@injectable()
export class JsonCommandAnalyzer extends AbstractCommandAnalyzer {

	private _dataContextResolver: DataContextResolver;
	private _pageContextResolver: PageContextResolver;
	private readonly _commands: CommandInformation[];
	private readonly _tmpCommands: { [key: string]: CommandInformation };
	private readonly COMMANDS_IGNORED = [OpenTabCommand];

	constructor(
	  @inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver,
	  @inject(TYPES.PageContextResolver) pageContextResolver: PageContextResolver
	) {
		super();
		this._commands = [];
		this._tmpCommands = {};
		this._dataContextResolver = dataContextResolver;
		this._pageContextResolver = pageContextResolver;
	}

	public async endCommand(command: AbstractCommand): Promise<void> {
		if (this.isIgnoredCommand(command)) {
			return;
		}
		const info = this._tmpCommands[command.uuid];
		if (!info) {
			return;
		}
		info.endOnUtc = moment().utc().toDate();
		info.status = 'success';
		this._commands.push(info);
		this._tmpCommands[command.uuid] = null;
	}

	public async errorCommand(command: AbstractCommand, failureReason: string): Promise<void> {
		if (this.isIgnoredCommand(command)) {
			return;
		}
		const info = this._tmpCommands[command.uuid];
		if (!info) {
			return;
		}
		info.endOnUtc = moment().utc().toDate();
		info.status = 'error';
		info.failureReason = failureReason;
		this._commands.push(info);
		this._tmpCommands[command.uuid] = null;
	}

	public async startCommand(command: AbstractCommand): Promise<void> {
		if (this.isIgnoredCommand(command)) {
			return;
		}
		const runTimeConfig = {};
		const managedKeys = command.getManagedKeys();
		for (const managedKey of managedKeys) {
			if ((typeof managedKey) === 'object') {
				const key = (managedKey as any).key as string;
				const fn = (managedKey as any).fn as () => Promise<string>;
				runTimeConfig[key] = await fn.call(command);
			} else {
				runTimeConfig[managedKey.toString()] = command[managedKey.toString()]
			}
		}
		if (command.designTimeConfig && command.designTimeConfig.commands) {
			delete command.designTimeConfig.commands;
		}
		const commandInformation = {
			cmd: command.cmd,
			name: command.constructor.name,
			startOnUtc: moment().utc().toDate(),
			uuid: command.uuid,
			dataContext: this._dataContextResolver.resolveContext(command),
			pageContext: this._pageContextResolver.resolveContext(command),
			runTimeConfig: runTimeConfig,
			designTimeConfig: command.designTimeConfig,
		} as CommandInformation;
		this._tmpCommands[command.uuid] = commandInformation;
	}

	public getCommands(): Promise<CommandInformation[]> {
		return Promise.resolve(this._commands.filter(x => x.cmd));
	}

	private isIgnoredCommand(command: AbstractCommand): boolean{
		const find = this.COMMANDS_IGNORED.find(x => {
			return command instanceof x;
		});
		return Boolean(find);
	}
}
