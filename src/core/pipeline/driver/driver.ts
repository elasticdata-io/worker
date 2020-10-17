import { AbstractCommand } from '../command/abstract-command';
import { DriverOptions } from './driver.options';
import {OpenTabCommand} from "../v2.0/command/open-tab.command";

export interface Driver {
	init(options: DriverOptions): Promise<void>;
	pause(command: AbstractCommand): Promise<void>;
	executeScript(command: AbstractCommand, ...args: any[]): Promise<string>;
	goToUrl(command: AbstractCommand, url: string, timeoutSec?: number): Promise<void>;
	domClick(command: AbstractCommand): Promise<void>;
	getScreenshot(command: AbstractCommand, options?: {quality: number}): Promise<Buffer>;
	nativeClick(command: AbstractCommand): Promise<void>;
	type(command: AbstractCommand, text: string): Promise<void>;
	hover(command: AbstractCommand): Promise<void>;
	waitElement(command: AbstractCommand): Promise<void>;
	getElText(command: AbstractCommand): Promise<string>;
	getElHtml(command: AbstractCommand): Promise<string>;
	getElHash(command: AbstractCommand): Promise<string>;
	getElAttribute(command: AbstractCommand, attributeName: string): Promise<string>;
	getElementsCount(command: AbstractCommand): Promise<number>;
	setElValue(command: AbstractCommand, value: string): Promise<void>;
	getCurrentUrl(command: AbstractCommand): Promise<string>;
	scrollBy(command: AbstractCommand, position: 'top' | 'bottom' | 'left' | 'right', px: number): Promise<void>;
	captureSnapshot(command: AbstractCommand): Promise<string>;
	destroyPage(pageContext: number): Promise<void>;
	getPageElements(command: AbstractCommand): Promise<any>;

	wait(timeoutMs: number, intervalMs: number, conditionFn: Function): Promise<void>;
	abort(): Promise<void>;
	destroy(): Promise<void>;
	hasBeenDestroyed(): boolean;
	hasBeenAborted(): boolean;
}
