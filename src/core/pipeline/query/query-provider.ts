import { AbstractCommand } from '../command/abstract-command';

export interface QueryProvider {
	getLoopElementSelector(command: AbstractCommand): string;
	isCompatibilitySelector(command: AbstractCommand): boolean;
}
