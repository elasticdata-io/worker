import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';

@injectable()
export class BrowserProvider extends IBrowserProvider {

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
	}

	async execute(command: AbstractCommand): Promise<void> {
		try {
			const browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
			if (browser.isStopped()) {
				return;
			}
			return await command.execute();
		} catch (e) {
			// todo : handle command error, statistics, metrics, etc.
			throw `ERROR of ${command.constructor.name}: ${e}`
		}
	}
}
