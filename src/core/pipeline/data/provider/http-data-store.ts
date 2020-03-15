import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';

export class HttpDataStore extends AbstractStore {

	async put(key: string, value: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		console.log(context, this.id);
		// console.log(context, key, value);
		return
	}
}
