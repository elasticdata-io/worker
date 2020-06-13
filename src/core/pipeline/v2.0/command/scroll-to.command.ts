import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';

@Cmd({cmd: 'scrollto', version: '2.0'})
export class ScrollToCommand extends AbstractCommand {

	@Assignable({required: false})
	public timeout = 3;

	@Assignable({required: false})
	public position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

	@Assignable({required: false})
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
