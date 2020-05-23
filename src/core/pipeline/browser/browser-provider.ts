import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';
import { AbstractCommandAnalyzer } from '../analyzer/abstract.command.analyzer';
import { DataContextResolver } from '../data/data-context-resolver';

@injectable()
export class BrowserProvider extends IBrowserProvider {
	private _browser: AbstractBrowser;
	private _commandAnalyzer: AbstractCommandAnalyzer;

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
		this._browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
	}

	async execute(command: AbstractCommand, config?: {silent: boolean, context: AbstractCommand}): Promise<void> {
		const context = config && config.context;
		const silent = config && config.silent;
		try {
			if (this._browser.isStopped()) {
				return;
			}
			if (context) {
				const contextResolver = this._ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
				contextResolver.copyCommandContext(context, [command])
			}
			if (!silent) {
				await this._commandAnalyzer.startCommand(command);
			}
			await command.execute();
		} catch (e) {
			if (!silent) {
				await this._commandAnalyzer.errorCommand(command, e.toString());
			}
			throw e
		}
	}
}
