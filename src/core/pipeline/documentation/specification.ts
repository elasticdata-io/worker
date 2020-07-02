import { AbstractCommand } from '../command/abstract-command';

export interface CommandPropertySpec {
	name: string;
	required: boolean
	type: any | any[]
	summary?: string
	default?: string
}

export interface CommandSpec {
	$class: string;
	version: string;
	cmd: string;
	type: CommandType;
	summary?: string;
	props: CommandPropertySpec[]
	examples?: any
}

export interface Specification {
	commands: CommandSpec[]
}

export const DOCUMENTATION = {
	commands: []
} as Specification

export enum CommandType {
	/**
	 * select data from page. Immutable.
	 */
	SELECTABLE = 'SELECTABLE',
	/**
	 * any action in page with mutable state.
	 */
	ACTION = 'ACTION',
	OTHER = 'OTHER',
}

export abstract class CommandSpecification {

	public static getAssignableProperties(command: AbstractCommand): string[] {
		const findCommand = DOCUMENTATION.commands.find(x => x.$class === command.constructor.name);
		if (findCommand) {
			return findCommand.props.map(x => x.name);
		}
		return [];
	}
}

export abstract class Checker {

	public static checkAssignableProperty(command: AbstractCommand, property: string): boolean {
		const ignoreKeys = ['uuid', 'cmd'];
		if (ignoreKeys.includes(property)) {
			return true;
		}
		const findCommand = DOCUMENTATION.commands.find(x => x.$class === command.constructor.name);
		if (findCommand) {
			const findProperty = findCommand.props.find(x => x.name === property);
			if (findProperty) {
				return true;
			}
		}
		return false;
	}
}
