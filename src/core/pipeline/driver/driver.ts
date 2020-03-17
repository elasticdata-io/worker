import { AbstractCommand } from '../command/abstract-command';
import { DriverOptions } from './driver.options';

export interface Driver {
	init(options: DriverOptions): Promise<void>;
	pause(command: AbstractCommand): Promise<void>;
	executeAsyncScript(script: string, ...args: any[]): Promise<string>;
	executeScript(script: string, ...args: any[]): Promise<string>;
	goToUrl(url: string, timeoutSec?: number): Promise<void>;
	domClick(command: AbstractCommand): Promise<void>;
	getScreenshot(command: AbstractCommand): Promise<Buffer>;
	nativeClick(command: AbstractCommand): Promise<void>;
	hover(command: AbstractCommand): Promise<void>;
	waitElement(command: AbstractCommand): Promise<void>;
	getElText(command: AbstractCommand): Promise<string>;
	getElHtml(command: AbstractCommand): Promise<string>;
	getElHash(command: AbstractCommand): Promise<string>;
	getElAttribute(command: AbstractCommand, attributeName: string): Promise<string>;
	getElementsCount(command: AbstractCommand): Promise<number>;
	setElValue(command: AbstractCommand, value: string): Promise<void>;
	getCurrentUrl(): Promise<string>;
	switchToFrame(command: AbstractCommand): Promise<void>;
	scrollBy(position: 'top' | 'bottom' | 'left' | 'right', px: number): Promise<void>;
}
