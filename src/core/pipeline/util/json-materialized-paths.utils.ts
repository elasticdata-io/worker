import { StringGenerator } from './string.generator';

interface Command {
	commands?: Command[];
	[key: string]: any;
}

export abstract class JsonMaterializedPathsUtils {

	public static readonly DELIMITER = '_';

	public static splitByDelimiter(uuid: string): string[] {
		return uuid.split(this.DELIMITER);
	}

	public static appendMaterializedPaths(
	  commands: Command[],
	  childProp = 'commands',
	  uuidProp= 'uuid'
	): string {
		this._appendMaterializedPaths(commands, childProp, uuidProp);
		return JSON.stringify(commands);
	}

	private static _appendMaterializedPaths(
		commands: Command[],
		childProp = 'commands',
		uuidProp= 'uuid',
		parentUuid = null
	): Command[] {
		commands.forEach((command, index) => {
			const id = parentUuid
			  ? `${parentUuid}${this.DELIMITER}${index}`
			  : `${index}`;
			command[uuidProp] = id;
			if (command[childProp]) {
				this._appendMaterializedPaths(command[childProp], childProp, uuidProp, id);
			}
		});
		return commands;
	}
}
