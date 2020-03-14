import { BrowserProvider } from '../browser/browser-provider';

export abstract class AbstractCommand {
	protected browserProvider: BrowserProvider;
	protected nextCommand: AbstractCommand;

	afterExecute(): Promise<void> {
		if (this.nextCommand) {
			return this.browserProvider.execute(this.nextCommand);
		}
	}

	public abstract execute(): Promise<void>;

	public setDependencies(browserProvider: BrowserProvider): void {
		this.browserProvider = browserProvider;
	}
}
