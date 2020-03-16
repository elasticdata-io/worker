import { Driver } from './driver';
import { Browser, Page } from 'puppeteer';
import { DriverOptions } from './driver.options';
import { injectable } from 'inversify';

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
	}

	async domClick(command): Promise<void> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getSelectionElFn(command, `.click()`);
		await this._page.evaluate(getElFn);
	}

	executeAsyncScript(script: string, arg: any): Promise<string> {
		return undefined;
	}

	executeScript(script: string, arg: any): Promise<string> {
		return undefined;
	}

	async getCurrentUrl(): Promise<string> {
		return this._page.url();
	}

	async getElAttribute(command, attributeName: string): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getSelectionElFn(command, `.getAttribute(${attributeName})`);
		return await this._page.evaluate(getElFn) as Promise<string>;
	}

	async getElText(command): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const getElFn = queryProvider.getSelectionElFn(command, '.innerText');
		return await this._page.evaluate(getElFn) as Promise<string>;
	}

	getElementsCount(command): Promise<number> {
		return undefined;
	}

	async goToUrl(url: string, timeoutSec: number): Promise<void> {
		await this._page.goto(url, {timeout: timeoutSec * 1000});
	}

	hover(command): Promise<void> {
		return undefined;
	}

	nativeClick(command): Promise<void> {
		return undefined;
	}

	getElHash(command): Promise<string> {
		return undefined;
	}

	getElHtml(command): Promise<string> {
		return undefined;
	}

	pause(seconds: number): Promise<void> {
		return undefined;
	}

	setElValue(command, value: string): Promise<void> {
		return undefined;
	}

	switchToFrame(command): Promise<void> {
		return undefined;
	}

	waitElement(command): Promise<void> {
		return undefined;
	}

	async getScreenshot(command): Promise<Buffer> {
		const base64 = await this._page.screenshot({
			encoding: 'base64',
		});
		return Buffer.from(base64, 'base64');
	}

}
