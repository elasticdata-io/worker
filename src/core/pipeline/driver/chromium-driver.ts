import { Driver } from './driver';
import { Browser, Page } from 'puppeteer';
import { DriverOptions } from './driver.options';
import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';

@injectable()
export class ChromiumDriver implements Driver {
	private _options: DriverOptions;
	private _page: Page;

	constructor(private _browser: Browser) {}

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
		const getElFn = queryProvider.getElementFn(command, `.getAttribute(${attributeName})`);
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

	async goToUrl(url: string, timeoutSec: number): Promise<void> {
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
		await this.wait(skipAfterTimeout, interval, async () => {
			const count = await this._page.evaluate(getCountFn) as number;
			return count > 0;
		});
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
		return new Promise(function(resolve) {
			setTimeout(resolve, time);
		});
	}

	protected async wait(timeoutMs: number, intervalMs: number, conditionFn: Function) {
		const start = new Date().getTime();
		return new Promise(async resolve => {
			const intervalId = setInterval(async () => {
				try {
					const end = new Date().getTime();
					const executeTime = end - start;
					if (executeTime >= timeoutMs) {
						clearInterval(intervalId);
						resolve();
						return;
					}
					const value = await conditionFn();
					if (value === true) {
						resolve();
					}
				} catch (e) {}
			}, intervalMs);
		});
	}
}
