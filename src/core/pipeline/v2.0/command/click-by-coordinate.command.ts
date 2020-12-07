import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
	cmd: 'click-xy',
	version: '2.0',
	type: CommandType.ACTION,
})
export class ClickByCoordinateCommand extends AbstractCommand {

	@Assignable({required: false, type: Number, default: 3})
	public timeout = 3;

	@Assignable({type: Number, required: true, default: undefined})
	public x: number;

	@Assignable({type: Number, required: true, default: undefined})
	public y: number;

	async execute(): Promise<void> {
		await this.driver.clickByCoordinate(this, {x: this.x, y: this.y});
		await super.execute();
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		return keys.concat(['x', 'y']);
	}
}
