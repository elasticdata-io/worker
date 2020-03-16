import { injectable } from 'inversify';

@injectable()
export class Environment {
	public userUuid: string;
}
