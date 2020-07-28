import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';
import { AbstractCommandAnalyzer } from '../analyzer/abstract.command.analyzer';
import { DataContextResolver } from '../data/data-context-resolver';
import {Pool} from "generic-pool";
import {Browser, Page} from "puppeteer";

@injectable()
export class BrowserProvider extends IBrowserProvider {
	private _browser: AbstractBrowser;
	private _commandAnalyzer: AbstractCommandAnalyzer;
	private _pool: Pool<{page: Page, browser: Browser}>;
	private _waitCompletedInterval: NodeJS.Timeout;

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
		this._browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
		this._pool = this._ioc.get<Pool<{page: Page, browser: Browser}>>(ROOT_TYPES.BrowserPool);
	}

	public async execute(command: AbstractCommand, config?: {silent: boolean, context: AbstractCommand}): Promise<void> {
		const context = config && config.context;
		const silent = config && config.silent;
		try {
			if (this._browser.hasBeenExited() && this._browser.hasBeenAborted()) {
				console.info(`SKIP COMMAND: ${command.constructor.name} because browser has been stopped`);
				return;
			}
			if (context) {
				const dataContextResolver = this._ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
				dataContextResolver.copyContext(context, [command])
			}
			if (!silent) {
				await this._commandAnalyzer.startCommand(command);
			}
			await command.execute();
		} catch (e) {
			if (!silent) {
				await this._commandAnalyzer.errorCommand(command, e.toString());
			}
			console.error(e);
			throw new Error(e)
		}
	}

	public async waitCompleted(): Promise<void> {
		return new Promise((resolve, reject) => {
			const waitPoolInterval = 1 * 1000;
			this._waitCompletedInterval = setInterval(() => {
				const pollCompleted = this._isPollCompleted();
				if (pollCompleted || this._browser.hasBeenExited()) {
					clearInterval(this._waitCompletedInterval);
					resolve();
				}
			}, waitPoolInterval);
		});
	}

	private _isPollCompleted(): boolean {
		return this._pool.pending === 0 && this._pool.borrowed <= 1;
	}
}
