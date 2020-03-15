import { Driver } from './driver';
import { Browser, Page } from 'puppeteer';
import { injectable } from 'inversify';

@injectable()
export class ChromiumDriver extends Driver {
	private _page: Page;

	constructor(private _browser: Browser) {
		super();
	}

	async init() {
		this._page = await this._browser.newPage();
	}

	domClick(selector: string): Promise<void> {
		return undefined;
	}

	executeAsyncScript(script: string, arg: any): Promise<string> {
		return undefined;
	}

	executeScript(script: string, arg: any): Promise<string> {
		return undefined;
	}

	getCurrentUrl(): Promise<string> {
		return undefined;
	}

	getElAttribute(command: any, attributeName: string): Promise<string> {
		return undefined;
	}

	getElText(command): Promise<string> {
		const queryProvider = command.getQueryProvider();
		const selector = queryProvider.getLoopElementSelector(command);
		return this._page.evaluate((s) => {
			return eval(s);
		}, `${selector}.innerText`);
	}

	getElementsCount(command: any): Promise<number> {
		return undefined;
	}

	async goToUrl(url: string, timeoutSec: number): Promise<void> {
		await this._page.goto(url, {timeout: timeoutSec * 1000});
	}

	hover(selector: string): Promise<void> {
		return undefined;
	}

	nativeClick(selector: string): Promise<void> {
		return undefined;
	}

	newgetElHash(command: any): Promise<string> {
		return undefined;
	}

	newgetElHtml(command: any): Promise<string> {
		return undefined;
	}

	pause(seconds: number): Promise<void> {
		return undefined;
	}

	setElValue(command: any, value: string): Promise<void> {
		return undefined;
	}

	switchToFrame(command: any): Promise<void> {
		return undefined;
	}

	waitElement(command: any): Promise<void> {
		return undefined;
	}

}
