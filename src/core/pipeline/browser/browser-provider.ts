import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';
import { AbstractCommandAnalyzer } from '../analyzer/abstract.command.analyzer';
import { SystemError } from '../command/exception/system-error';

@injectable()
export class BrowserProvider extends IBrowserProvider {
	private _browser: AbstractBrowser;
	private _commandAnalyzer: AbstractCommandAnalyzer;

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
		this._browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
	}

	async execute(command: AbstractCommand): Promise<void> {
		try {
			if (this._browser.isStopped()) {
				return;
			}
			await this._commandAnalyzer.startCommand(command);
			await command.execute();
		} catch (e) {
			await this._commandAnalyzer.errorCommand(command, e.toString());
			if (e instanceof SystemError) {
				throw e;
			}
			throw `ERROR of ${command.constructor.name}: ${e}`
		}
	}
}
