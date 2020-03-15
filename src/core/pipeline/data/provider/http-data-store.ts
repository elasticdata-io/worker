import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';

export class HttpDataStore extends AbstractStore {

	async put(key: string, value: string, command: AbstractCommand): Promise<void> {
		console.log(key, value);
		return
	}
}
