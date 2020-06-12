import { AbstractCommand } from '../abstract-command';

export function Assignable(config?: { required?: boolean }) {
	const decorator = function(target: AbstractCommand, key: string | symbol) {
		// console.log(AbstractCommand[key])
	};
	return decorator;
}
