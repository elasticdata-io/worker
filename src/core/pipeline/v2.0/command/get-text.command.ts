import { AbstractCommand } from '../../command/abstract-command';

export class GetTextCommand extends AbstractCommand {

	public key: string;

	async execute(): Promise<void> {
		const text = await this.driver.getElText(this);
		console.log(text);
		super.execute();
	}
}
