import { BrowserProvider } from '../browser/browser-provider';
import { inject, injectable } from 'inversify';
import { Selectable } from '../query/selectable';
import { QueryProvider } from '../query/query-provider';
import { QueryProviderFactory } from '../query/query-provider-factory';

@injectable()
export abstract class AbstractCommand implements Selectable {

	protected selector: string;
	protected queryProviderFactory: QueryProviderFactory;
	protected browserProvider: BrowserProvider;
	private _nextCommand: AbstractCommand;

	public setNextCommand(nextCommand: AbstractCommand): void {
		this._nextCommand = nextCommand;
	}

	public async execute(): Promise<void> {
		await this.afterExecute();
	}

	protected async afterExecute(): Promise<void> {
		if (this._nextCommand) {
			return this.browserProvider.execute(this._nextCommand);
		}
	}

	getSelector(): string {
		return this.selector;
	}

	getQueryProvider(): QueryProvider {
		return this.queryProviderFactory.resolve(this);
	}
}
