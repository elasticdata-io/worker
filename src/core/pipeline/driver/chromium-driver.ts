import { Driver } from './driver';
import { Browser } from 'puppeteer';

export class ChromiumDriver extends Driver {
	constructor(private _browser: Browser) {
		super();
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
		return undefined;
	}

	getElementsCount(command: any): Promise<number> {
		return undefined;
	}

	goToUrl(url: string, timeoutSec: number): Promise<void> {
		return undefined;
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
