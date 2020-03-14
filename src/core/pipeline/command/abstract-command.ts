import { BrowserProvider } from '../browser/browser-provider';
import { Driver } from '../driver/driver';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractCommand {
	protected driver: Driver;
	protected browserProvider: BrowserProvider;
	protected nextCommand: AbstractCommand;

	afterExecute(): Promise<void> {
		if (this.nextCommand) {
			return this.browserProvider.execute(this.nextCommand);
		}
	}

	public abstract execute(): Promise<void>;

	public setDependencies(browserProvider: BrowserProvider,
						   driver: Driver): void {
		this.browserProvider = browserProvider;
		this.driver = driver;
	}
}
