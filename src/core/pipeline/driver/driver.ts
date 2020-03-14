export abstract class Driver {
	abstract pause(seconds: number): Promise<void>;
	abstract executeAsyncScript(script: string, arg: any): Promise<string>;
	abstract executeScript(script: string, arg: any): Promise<string>;
	abstract goToUrl(url: string, timeoutSec: number): Promise<void>;
	abstract domClick(selector: string): Promise<void>;
	abstract nativeClick(selector: string): Promise<void>;
	abstract hover(selector: string): Promise<void>;
	abstract waitElement(command: any): Promise<void>;
	abstract getElText(command): Promise<string>;
	abstract newgetElHtml(command: any): Promise<string>;
	abstract newgetElHash(command: any): Promise<string>;
	abstract getElAttribute(command: any, attributeName: string): Promise<string>;
	abstract getElementsCount(command: any): Promise<number>;
	abstract setElValue(command: any, value: string): Promise<void>;
	abstract getCurrentUrl(): Promise<string>;
	abstract switchToFrame(command: any): Promise<void>;
}
