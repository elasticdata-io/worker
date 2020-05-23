import { AbstractCommandAnalyzer } from '../abstract.command.analyzer';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { CommandInformation } from '../command.information';
import moment = require('moment');
import { TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';

@injectable()
export class JsonCommandAnalyzer extends AbstractCommandAnalyzer {

	private _dataContextResolver: DataContextResolver;
	private readonly _commands: CommandInformation[];
	private readonly _tmpCommands: { [key: string]: CommandInformation };

	constructor(@inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver) {
		super();
		this._commands = [];
		this._tmpCommands = {};
		this._dataContextResolver = dataContextResolver;
	}

	public async endCommand(command: AbstractCommand): Promise<void> {
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
		const params = {};
		command
		  .getManagedKeys()
		  .forEach(key => params[key] = command[key]);
		const result = {
			startOnUtc: moment().utc().toDate(),
			uuid: command.uuid,
			name: command.constructor.name,
			dataContext: this._dataContextResolver.resolveContext(command),
			json: params,
		} as CommandInformation;
		this._tmpCommands[command.uuid] = result;
	}

	public getCommands(): Promise<CommandInformation[]> {
		return Promise.resolve(this._commands);
	}
}
