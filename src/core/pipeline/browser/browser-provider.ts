import { AbstractCommand } from '../command/abstract-command';
import { IBrowserProvider } from './i-browser-provider';
import { TYPES as ROOT_TYPES, TYPES } from '../types';
import { PipelineIoc } from '../pipeline-ioc';
import { AbstractBrowser } from './abstract-browser';
import { inject, injectable } from 'inversify';

@injectable()
export class BrowserProvider extends IBrowserProvider {
	private _browser: AbstractBrowser;

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
		this._browser = this._ioc.get<AbstractBrowser>(TYPES.AbstractBrowser);
	}

	async execute(command: AbstractCommand): Promise<void> {
		try {
			if (this._browser.isStopped()) {
				return;
			}
			return await command.execute();
		} catch (e) {
			// todo : handle command error, statistics, metrics, etc.
			throw `ERROR of ${command.constructor.name}: ${e}`
		}
	}
}
