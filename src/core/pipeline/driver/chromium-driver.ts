import * as chalk from 'chalk';
import { Driver } from './driver';
import { Browser, Page } from 'puppeteer';
import { DriverOptions } from './driver.options';
import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { Timer } from '../util/timer';
import { JsCommand } from '../v2.0/command/js.command';
import {PageContextResolver} from "../browser/page-context-resolver";
import {TYPES as ROOT_TYPES} from "../types";
import {PipelineIoc} from "../pipeline-ioc";
import {Pool} from "generic-pool";
import {SystemError} from "../command/exception/system-error";

@injectable()
export class ChromiumDriver implements Driver {
	private _timer: Timer;
	private _options: DriverOptions;
	private _pages: Array<{page: Page, browser: Browser}> = [];
	private _hasBeenExited: boolean;
	private _pageContextResolver: PageContextResolver;
	private _pool: Pool<{page: Page, browser: Browser}>;

	constructor(private _ioc: PipelineIoc) {
		this._timer = new Timer();
		this._timer.watchStopByFn(() => {
			return this.hasBeenExited() === true;
		});
		this._pageContextResolver = this._ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		this._pool = this._ioc.get<Pool<{page: Page, browser: Browser}>>(ROOT_TYPES.BrowserPool);
	}

	//region Method: Public

	public async init(options: DriverOptions) {
		this._options = options;
	}

	public async domClick(command: AbstractCommand): Promise<void> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.click()`);
		const page = await this._resolvePage(command);
		await this.pageEvaluate(getElFn, page);
	}

	public async executeScript(command: JsCommand, ...args: any[]): Promise<any> {
		const page = await this._resolvePage(command);
		return await page.evaluate((fnString) => {
			return eval(fnString);
		}, command.script);
	}

	public async getCurrentUrl(command: AbstractCommand): Promise<string> {
		const page = await this._resolvePage(command);
		return page.url();
	}

	public async getElAttribute(command: AbstractCommand, attributeName: string): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.getAttribute('${attributeName}')`);
		const page = await this._resolvePage(command);
		return await this.pageEvaluate(getElFn, page);
	}

	public async getElText(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerText');
		const page = await this._resolvePage(command);
		return await this.pageEvaluate(getElFn, page);
	}

	public async getElHtml(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerHTML');
		const page = await this._resolvePage(command);
		return await this.pageEvaluate(getElFn, page);
	}

	public async getElementsCount(command: AbstractCommand): Promise<number> {
		const queryProvider = command.getQueryProvider();
		const getCountFn = queryProvider.getElementsFn(command, '.length');
		const page = await this._resolvePage(command);
		const count = await page.evaluate(getCountFn) as string;
		return count && parseInt(count, 10) || 0;
	}

	public async goToUrl(command: AbstractCommand, url: string, timeoutSec = 1): Promise<void> {
		const targetUrl = new URL(url);
		const page = await this._resolvePage(command);
		await page.goto(targetUrl.href, {timeout: timeoutSec * 1000});
	}

	public async hover(command: AbstractCommand): Promise<void> {
		// todo: supporting only CSS selector ?
		const page = await this._resolvePage(command);
		await page.hover(command.selector);
	}

	public async nativeClick(command: AbstractCommand): Promise<void> {
		const page = await this._resolvePage(command);
		await page.click(command.selector);
	}

	public async getElHash(command: AbstractCommand): Promise<string> {
		return undefined;
	}

	public async pause(command: AbstractCommand): Promise<void> {
		await this.delay(command.timeout * 1000);
	}

	public async setElValue(command: AbstractCommand, value: string): Promise<void> {
		const queryProvider = command.getQueryProvider();
		// todo : input, textarea, select
		const getElFn = queryProvider.getElementFn(command, `.value = \`${value}\`;`);
		// await this._page.focus('#lst-ib')
		const page = await this._resolvePage(command);
		await this.pageEvaluate(getElFn, page);
	}

	public async waitElement(command: AbstractCommand): Promise<void> {
		const skipAfterTimeout = command.timeout * 1000;
		const interval = 250;
		const queryProvider = command.getQueryProvider();
		const getOuterHTMLFn = queryProvider.getElementFn(command, '.outerHTML');
		try {
			await this.wait(skipAfterTimeout, interval, async () => {
				const page = await this._resolvePage(command);
				const html = await this.pageEvaluate(getOuterHTMLFn, page);
				return Boolean(html);
			});
		} catch (e) {
			throw `${command.cmd} terminated after: ${skipAfterTimeout} ms, ${getOuterHTMLFn.toString()}`
		}
	}

	public async getScreenshot(command: AbstractCommand): Promise<Buffer> {
		const page = await this._resolvePage(command);
		const base64 = await page.screenshot({
			encoding: 'base64',
		});
		return Buffer.from(base64, 'base64');
	}

	public async scrollBy(command: AbstractCommand, position: 'top' | 'bottom', px: number): Promise<void> {
		const distance = position === 'bottom' ? px : -px;
		const expression = `window.scrollBy(0, ${distance})`;
		const fn = new Function(expression);
		const page = await this._resolvePage(command);
		await this.pageEvaluate(fn, page);
	}

	/**
	 * More details https://docs.google.com/document/d/1FvmYUC0S0BkdkR7wZsg0hLdKc_qjGnGahBwwa0CdnHE/edit
	 * @return {Promise<string>} MHTML page format
	 */
	public async captureSnapshot(command: AbstractCommand): Promise<string> {
		const page = await this._resolvePage(command);
		const cdpSession = await page.target().createCDPSession()
		const result = await cdpSession.send('Page.captureSnapshot') as any;
		return result.data.toString();
	}

	public async releasePageContext(pageContext: number): Promise<void> {
		const resource = this._pages[pageContext];
		if (resource) {
			await this._pool.release(resource);
		} else {
			console.error(`resource with context: ${pageContext} not found`)
		}
	}

	public async abort(): Promise<void> {
		if (this.hasBeenExited()) {
			return;
		}
		for (const page of this._pages) {
			await this._pool.release(page);
		}
		await this._pool.drain();
	}

	public async exit(): Promise<void> {
		if (this.hasBeenExited()) {
			return;
		}
		const mainPage = this._pages[0];
		if (mainPage && this._pool.isBorrowedResource(mainPage)) {
			await this._pool.release(mainPage);
		}
		await this._pool.drain();
		await this._pool.clear();
		for (const page of this._pages) {
			await page.browser.close();
		}
		this._pages = [];
		console.log(chalk.cyan('browser has been closed...'));
		this._hasBeenExited = true;
	}

	public hasBeenExited(): boolean {
		return this._hasBeenExited;
	}

	//endregion

	//region Method: Protected

	protected async delay(time: number) {
		return new Promise((resolve) => {
			const id = setTimeout(resolve, time);
			this._timer.addSetTimeoutId(id, () => {
				resolve();
			});
		});
	}

	protected async wait(timeoutMs: number, intervalMs: number, conditionFn: Function) {
		const start = new Date().getTime();
		return new Promise(async (resolve, reject) => {
			const intervalId = setInterval(async () => {
				try {
					const end = new Date().getTime();
					const executeTime = end - start;
					if (executeTime >= timeoutMs) {
						clearInterval(intervalId);
						reject(`max waiting timeout: ${timeoutMs}ms`);
						return;
					}
					const value = await conditionFn();
					if (value === true) {
						clearInterval(intervalId);
						resolve();
					}
				} catch (e) {}
				this._timer.addSetIntervalId(intervalId, () => resolve());
			}, intervalMs);
		});
	}

	protected async pageEvaluate(fn: any, page: Page): Promise<string> {
		try {
			return await page.evaluate(fn) as Promise<string>;
		} catch (e) {
			throw `${e} --- ${fn}`;
		}
	}

	//endregion

	//region Method: Private

	private async _createNewResource(): Promise<{page: Page, browser: Browser}> {
		return await this._pool.acquire();
	}

	private async _resolvePage(command: AbstractCommand): Promise<Page> {
		const pageContextResolver = this._ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		const context = pageContextResolver.resolveContext(command);
		let resource = this._pages[context];
		if (!resource) {
			resource = await this._createNewResource();
			if (this._pages[context]) {
				throw new SystemError(`resource with context: ${context} has been created`);
			}
			this._pages[context] = resource;
		}
		return resource.page;
	}

	//endregion
}
