import { AbstractCommand } from '../../command/abstract-command';
import { Driver } from '../../driver/driver';
import { inject } from 'inversify';
import { TYPES as ROOT_TYPES } from '../../types';

export class OpenUrlCommand extends AbstractCommand {
	constructor(@inject(ROOT_TYPES.Driver) private _driver: Driver) {
		super();
	}

	public link: string;

	async execute(): Promise<void> {
		await this._driver.goToUrl(this.link);
	}

}
