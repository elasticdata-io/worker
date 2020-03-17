import { AbstractCommand } from '../../command/abstract-command';

export class JsCommand extends AbstractCommand {

	key: string;
	script: string;

	async execute(): Promise<void> {
		const result = await this.driver.executeScript(this.script, null);
		if (result !== undefined && result !== null) {
			await this.store.put(this.key, result, this);
		}
		await super.execute();
	}
}
