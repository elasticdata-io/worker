import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';

@injectable()
export class DataContextResolver {

	public resolveContext(command: AbstractCommand): string {
		return 'root';
	}
}
