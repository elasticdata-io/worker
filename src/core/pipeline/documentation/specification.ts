export interface CommandPropertySpec {
	name: string;
	required: boolean
}

export interface CommandSpec {
	$class: string;
	version: string;
	cmd: string;
	props: CommandPropertySpec[]
}

export interface Specification {
	commands: CommandSpec[]
}

export const DOCUMENTATION = {
	commands: []
} as Specification

