import * as chalk from 'chalk';
import { Driver } from './driver';
import { Browser, CDPSession, Page } from 'puppeteer';
import { DriverOptions } from './driver.options';
import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { Timer } from '../util/timer';

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

	async init(options: DriverOptions) {
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

	async domClick(command: AbstractCommand): Promise<void> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.click()`);
		await this._page.evaluate(getElFn);
	}

	async executeAsyncScript(script: string, ...args: any[]): Promise<string> {
		return undefined;
	}

	async executeScript(script: string, ...args: any[]): Promise<any> {
		return await this._page.evaluate((fnString) => {
			return eval(fnString);
		}, script);
	}

	async getCurrentUrl(): Promise<string> {
		return this._page.url();
	}

	async getElAttribute(command: AbstractCommand, attributeName: string): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, `.getAttribute('${attributeName}')`);
		return await this._page.evaluate(getElFn) as Promise<string>;
	}

	async getElText(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerText');
		return await this._page.evaluate(getElFn) as Promise<string>;
	}

	async getElHtml(command: AbstractCommand): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getElementFn(command, '.innerHtml');
		return await this._page.evaluate(getElFn) as Promise<string>;
	}

	async getElementsCount(command: AbstractCommand): Promise<number> {
		const queryProvider = command.getQueryProvider();
		const getCountFn = queryProvider.getElementsFn(command, '.length');
		const count = await this._page.evaluate(getCountFn) as string;
		return count && parseInt(count, 10) || 0;
	}

	async goToUrl(url: string, timeoutSec = 1): Promise<void> {
		await this._page.goto(url, {timeout: timeoutSec * 1000});
	}

	async hover(command: AbstractCommand): Promise<void> {
		// todo: supporting only CSS selector ?
		await this._page.hover(command.selector);
	}

	async nativeClick(command: AbstractCommand): Promise<void> {
		await this._page.click(command.selector);
	}

	async getElHash(command: AbstractCommand): Promise<string> {
		return undefined;
	}

	async pause(command: AbstractCommand): Promise<void> {
		await this.delay(command.timeout * 1000);
	}

	async setElValue(command: AbstractCommand, value: string): Promise<void> {
		return undefined;
	}

	async switchToFrame(command: AbstractCommand): Promise<void> {
		return undefined;
	}

	async waitElement(command: AbstractCommand): Promise<void> {
		const skipAfterTimeout = command.timeout * 1000;
		const interval = 250;
		const queryProvider = command.getQueryProvider();
		const getCountFn = queryProvider.getElementsFn(command, '.length');
		try {
			await this.wait(skipAfterTimeout, interval, async () => {
				const count = await this._page.evaluate(getCountFn) as number;
				return count > 0;
			});
		} catch (e) {
			throw `${command.constructor.name} terminated after: ${skipAfterTimeout} ms, ${getCountFn.toString()}`
		}
	}

	async getScreenshot(command: AbstractCommand): Promise<Buffer> {
		const base64 = await this._page.screenshot({
			encoding: 'base64',
		});
		return Buffer.from(base64, 'base64');
	}

	async scrollBy(position: 'top' | 'bottom' | 'left' | 'right', px: number): Promise<void> {
		return undefined;
	}

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

	async exit(): Promise<void> {
		if (this.hasBeenExited()) {
			return;
		}
		await this._browser.close();
		console.log(chalk.cyan('browser has been closed...'));
		this._hasBeenExited = true;
	}

	hasBeenExited(): boolean {
		return this._hasBeenExited;
	}

	/**
	 * More details https://docs.google.com/document/d/1FvmYUC0S0BkdkR7wZsg0hLdKc_qjGnGahBwwa0CdnHE/edit
	 * @return {Promise<string>} MHTML page format
	 */
	async captureSnapshot(): Promise<string> {
		const result = await this._cdpSession.send('Page.captureSnapshot') as any;
		return result.data.toString();
	}
}
