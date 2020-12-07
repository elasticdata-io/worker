import { AbstractCommand } from '../command/abstract-command';
import {ExecuteCommandConfig, IBrowserProvider} from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';
import { AbstractCommandAnalyzer } from '../analyzer/abstract.command.analyzer';
import { DataContextResolver } from '../data/data-context-resolver';
import { Pool } from "generic-pool";
import { Browser, Page } from "puppeteer";
import { UserInteractionInspector } from "../user-interaction";
import {PageContextResolver} from "./page-context-resolver";
import {Driver} from "../driver/driver";
import {CaptchaService} from "../service/captcha.service";

@injectable()
export class BrowserProvider extends IBrowserProvider {
	private _browser: AbstractBrowser;
	private _commandAnalyzer: AbstractCommandAnalyzer;
	private _pool: Pool<{page: Page, browser: Browser}>;
	private _waitCompletedInterval: NodeJS.Timeout;
	private _userInteractionInspector: UserInteractionInspector;

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
		this._browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
		this._commandAnalyzer = this._ioc.get<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer);
		this._pool = this._ioc.get<Pool<{page: Page, browser: Browser}>>(ROOT_TYPES.BrowserPool);
		this._userInteractionInspector = this._ioc.get<UserInteractionInspector>(ROOT_TYPES.UserInteractionInspector);
	}

	/**
	 * Invoke for first command in pipeline.
	 * Initialize main thread.
	 * @param command First command in pipeline.
	 */
	public async start(command: AbstractCommand): Promise<void> {
		const driver = this._ioc.get<Driver>(TYPES.Driver);
		await driver.initMainThread();
		await this.execute(command);
	}

	public async execute(command: AbstractCommand, config?: ExecuteCommandConfig): Promise<void> {
		const inDataContext = config && config.inDataContext;
		const inPageContext = config && config.inPageContext;
		const silent = config && config.silent;
		try {
			if (this._browser.hasBeenDestroyed() && this._browser.hasBeenAborted()) {
				console.info(`SKIP COMMAND: ${command.constructor.name} because browser has been stopped`);
				return;
			}
			if (typeof inDataContext === 'string') {
				const dataContextResolver = this._ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
				dataContextResolver.copyContext(inDataContext, [command])
			}
			if (typeof inPageContext === 'number' || inPageContext instanceof AbstractCommand) {
				const pageContextResolver = this._ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
				pageContextResolver.copyContext(inPageContext, [command])
			}
			if (!silent) {
				await this._commandAnalyzer.startCommand(command);
			}
			const captchaService = this._ioc.get<CaptchaService>(ROOT_TYPES.CaptchaService)
			if (await captchaService.checkHasCaptcha(command)) {
				await captchaService.resolveCaptcha(command);
			}
			await command.execute();
		} catch (e) {
			if (!silent) {
				await this._commandAnalyzer.errorCommand(command, e.toString());
			}
			throw e
		}
	}

	public async waitCompleted(): Promise<void> {
		return new Promise((resolve, reject) => {
			const waitPoolInterval = 1 * 1000;
			this._waitCompletedInterval = setInterval(() => {
				const pollCompleted = this._isPollCompleted();
				if (pollCompleted || this._browser.hasBeenDestroyed()) {
					clearInterval(this._waitCompletedInterval);
					resolve();
				}
			}, waitPoolInterval);
		});
	}

	private _isPollCompleted(): boolean {
		console.log(`this._pool.pending = ${this._pool.pending}, this._pool.borrowed = ${this._pool.borrowed}`);
		return this._pool.pending === 0 && this._pool.borrowed <= 1;
	}
}
