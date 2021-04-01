import { AbstractCommand } from '../command/abstract-command';

export interface QueryProvider {
	getElementFn(command: AbstractCommand, suffix: string): any;
	getElementsFn(command: AbstractCommand, suffix: string): any;
	isSupporting(command: AbstractCommand): boolean;
}
