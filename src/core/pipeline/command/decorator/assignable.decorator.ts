import * as App from '../../documentation/specification';
import { AbstractCommand } from '../abstract-command';

export function Assignable(config?: { required?: boolean }) {
	const decorator = function(target: AbstractCommand, key: string | symbol) {
		let command = App.DOCUMENTATION.commands.find(x => x.$class === target.constructor.name);
		if (!command) {
			App.DOCUMENTATION.commands.push({
				$class: target.constructor.name,
				version: null,
				cmd: null,
				props: []
			})
			command = App.DOCUMENTATION.commands.find(x => x.$class === target.constructor.name);
		}
		command.props.push({
			name: key.toString(),
			required: config?.required === undefined ? true : config?.required
		});
	};
	return decorator;
}
