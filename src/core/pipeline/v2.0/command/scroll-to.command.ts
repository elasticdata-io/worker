import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'scrollto',
	version: '2.0',
	type: CommandType.ACTION,
	summary: `doc.SCROLLTO.SUMMARY`,
})
export class ScrollToCommand extends AbstractCommand {

	@Assignable({required: false, type: Number, default: 3})
	public timeout = 3;

	@Assignable({
		required: false,
		type: ['top', 'bottom', 'left', 'right'],
		default: 'bottom'
	})
	public position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

	@Assignable({required: false, type: Number, default: 50})
	public px?: number = 50;

	async execute(): Promise<void> {
		await this.driver.scrollBy(this, this.position, this.px);
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['position', 'px']);
	}
}
