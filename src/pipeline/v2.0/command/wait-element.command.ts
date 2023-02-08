import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
  cmd: 'waitelement',
  version: '2.0',
  type: CommandType.OTHER,
  summary: `doc.WAITELEMENT.SUMMARY`,
})
export class WaitElementCommand extends AbstractCommand {
  @Assignable({ required: false, type: Number, default: 5 })
  public timeout = 5;

  @Assignable({ type: String, default: undefined })
  public selector: string;

  async execute(): Promise<void> {
    await this.driver.waitElement(this);
    await super.execute();
  }

  public getManagedKeys(): Array<
    { key: string; fn: () => Promise<string> } | string
  > {
    const keys = super.getManagedKeys();
    return keys.concat(['selector']);
  }
}
