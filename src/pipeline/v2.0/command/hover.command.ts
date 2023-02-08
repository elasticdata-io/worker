import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
  cmd: 'hover',
  version: '2.0',
  type: CommandType.ACTION,
  summary: `doc.HOVER.SUMMARY`,
})
export class HoverCommand extends AbstractCommand {
  @Assignable({ required: false, type: Number, default: 3 })
  public timeout = 3;

  @Assignable({ type: String, default: undefined })
  public selector: string;

  async execute(): Promise<void> {
    await this.driver.waitElement(this);
    await this.driver.hover(this);
    await super.execute();
  }

  public getManagedKeys(): Array<
    { key: string; fn: () => Promise<string> } | string
  > {
    const keys = super.getManagedKeys();
    return keys.concat(['selector']);
  }
}
