import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';
import { LineMacrosParser } from '../../data/line-macros-parser';

@Cmd({
	cmd: 'type',
	version: '2.0',
	type: CommandType.ACTION,
	summary: `doc.TYPE.SUMMARY`
})
export class TypeCommand extends AbstractCommand {

	@Assignable({required: false, type: Number, default: 3})
	public timeout = 3;

	@Assignable({
		required: true,
		type: [String],
		default: '',
		summary: 'Always supporting macros like "{$i}" or {$line.keyOfLine}',
	})
	public text = '';

	@Assignable({type: String, default: undefined})
	public selector: string;

	async execute(): Promise<void> {
		await this.driver.waitElement(this);
		const text = await this._getText();
		await this.driver.type(this, text);
		await super.execute();
	}

	private async _getText(): Promise<string> {
		return await this.replaceMacros(this.text, this);
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		const keys = super.getManagedKeys();
		if (LineMacrosParser.hasAnyMacros(this.text)) {
			keys.push({
				key: 'text_runtime',
				fn: this._getText
			});
		}
		return keys.concat(['selector']);
	}
}
