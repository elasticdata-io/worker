import { AbstractCommand } from '../../command/abstract-command';


export class ScrollToCommand extends AbstractCommand {

	public position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	public px?: number = 50;

	async execute(): Promise<void> {
		await this.driver.scrollBy(this, this.position, this.px);
		await super.execute();
	}

	public getManagedKeys(): string[] {
		const keys = super.getManagedKeys();
		return keys.concat(['position', 'px']);
	}
}
