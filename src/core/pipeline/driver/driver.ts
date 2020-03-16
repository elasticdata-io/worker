import { AbstractCommand } from '../command/abstract-command';

export abstract class Driver {
	abstract async init();
	abstract pause(seconds: number): Promise<void>;
	abstract executeAsyncScript(script: string, arg: any): Promise<string>;
	abstract executeScript(script: string, arg: any): Promise<string>;
	abstract goToUrl(url: string, timeoutSec?: number): Promise<void>;
	abstract domClick(command: AbstractCommand): Promise<void>;
	abstract getScreenshot(command: AbstractCommand): Promise<Buffer>;
	abstract nativeClick(command: AbstractCommand): Promise<void>;
	abstract hover(command: AbstractCommand): Promise<void>;
	abstract waitElement(command: AbstractCommand): Promise<void>;
	abstract getElText(command: AbstractCommand): Promise<string>;
	abstract getElHtml(command: AbstractCommand): Promise<string>;
	abstract getElHash(command: AbstractCommand): Promise<string>;
	abstract getElAttribute(command: AbstractCommand, attributeName: string): Promise<string>;
	abstract getElementsCount(command: AbstractCommand): Promise<number>;
	abstract setElValue(command: AbstractCommand, value: string): Promise<void>;
	abstract getCurrentUrl(): Promise<string>;
	abstract switchToFrame(command: AbstractCommand): Promise<void>;
}
