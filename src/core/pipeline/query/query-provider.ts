import { AbstractCommand } from '../command/abstract-command';

export interface QueryProvider {
	getSelectionElFn(command: AbstractCommand, suffix: string): Function;
	isSupporting(command: AbstractCommand): boolean;
}
