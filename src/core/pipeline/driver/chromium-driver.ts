import * as chalk from 'chalk';
import { Driver } from './driver';
import { Browser, CDPSession, Page } from 'puppeteer';
import { DriverOptions } from './driver.options';
import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { Timer } from '../util/timer';
import { JsCommand } from '../v2.0/command/js.command';

@injectable()
export class ChromiumDriver implements Driver {
	private _timer: Timer;
	private _options: DriverOptions;
	private _page: Page;
	private _hasBeenExited: boolean;
	private _cdpSession: CDPSession;

	constructor(private _browser: Browser) {
		this._timer = new Timer();
		this._timer.watchStopByFn(() => {
			return this.hasBeenExited() === true;
		});
	}

	//region Method: Public

	public async init(options: DriverOptions) {
		this._options = options;
		this._page = await this._browser.newPage();
		if (this._options && this._options.width) {
			await this._page.setViewport({
				width: this._options.width,
				height: this._options.height
			});
		}
		if (this._options && this._options.language) {
			await this._page.setExtraHTTPHeaders({
				'Accept-Language': this._options.language
			});
		}
		this._cdpSession = await this._page.target().createCDPSession();
	}

	public async domClick(command: AbstractCommand): Promise<void> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.click()`);
		await this.pageEvaluate(getElFn);
	}

	public async executeScript(command: JsCommand, ...args: any[]): Promise<any> {
		return await this._page.evaluate((fnString) => {
			return eval(fnString);
		}, command.script);
	}

	public async getCurrentUrl(command: AbstractCommand): Promise<string> {
		return this._page.url();
	}

	public async getElAttribute(command: AbstractCommand, attributeName: string): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.getAttribute('${attributeName}')`);
		return await this.pageEvaluate(getElFn);
	}

	public async getElText(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerText');
		return await this.pageEvaluate(getElFn);
	}

	public async getElHtml(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerHTML');
		return await this.pageEvaluate(getElFn);
	}

	public async getElementsCount(command: AbstractCommand): Promise<number> {
		const queryProvider = command.getQueryProvider();
		const getCountFn = queryProvider.getElementsFn(command, '.length');
		const count = await this._page.evaluate(getCountFn) as string;
		return count && parseInt(count, 10) || 0;
	}

	public async goToUrl(command: AbstractCommand, url: string,
											 timeoutSec = 1): Promise<void> {
		await this._page.goto(url, {timeout: timeoutSec * 1000});
	}

	public async hover(command: AbstractCommand): Promise<void> {
		// todo: supporting only CSS selector ?
		await this._page.hover(command.selector);
	}

	public async nativeClick(command: AbstractCommand): Promise<void> {
		await this._page.click(command.selector);
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
		await this.pageEvaluate(getElFn);
	}

	public async waitElement(command: AbstractCommand): Promise<void> {
		const skipAfterTimeout = command.timeout * 1000;
		const interval = 250;
		const queryProvider = command.getQueryProvider();
		const getOuterHTMLFn = queryProvider.getElementFn(command, '.outerHTML');
		try {
			await this.wait(skipAfterTimeout, interval, async () => {
				const html = await this.pageEvaluate(getOuterHTMLFn);
				return Boolean(html);
			});
		} catch (e) {
			throw `${command.cmd} terminated after: ${skipAfterTimeout} ms, ${getOuterHTMLFn.toString()}`
		}
	}

	public async getScreenshot(command: AbstractCommand): Promise<Buffer> {
		const base64 = await this._page.screenshot({
			encoding: 'base64',
		});
		return Buffer.from(base64, 'base64');
	}

	public async scrollBy(command: AbstractCommand, position: 'top' | 'bottom', px: number): Promise<void> {
		const distance = position === 'bottom' ? px : -px;
		const expression = `window.scrollBy(0, ${distance})`;
		const fn = new Function(expression);
		await this.pageEvaluate(fn);
	}

	/**
	 * More details https://docs.google.com/document/d/1FvmYUC0S0BkdkR7wZsg0hLdKc_qjGnGahBwwa0CdnHE/edit
	 * @return {Promise<string>} MHTML page format
	 */
	public async captureSnapshot(command: AbstractCommand): Promise<string> {
		const result = await this._cdpSession.send('Page.captureSnapshot') as any;
		return result.data.toString();
	}

	public async exit(): Promise<void> {
		if (this.hasBeenExited()) {
			return;
		}
		await this._browser.close();
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
						reject();
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

	protected async pageEvaluate(fn: any): Promise<string> {
		try {
			return await this._page.evaluate(fn) as Promise<string>;
		} catch (e) {
			throw `${e} --- ${fn}`;
		}
	}

	//endregion
}
