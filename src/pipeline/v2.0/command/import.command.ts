import { AbstractCommand } from '../../command/abstract-command';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { Cmd } from '../../command/decorator/command.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
  cmd: 'import',
  version: '2.0',
  type: CommandType.OTHER,
  summary: `doc.IMPORT.SUMMARY`,
})
export class ImportCommand extends AbstractCommand {
  @Assignable({ type: Array, default: [] })
  public array: any[] = [];

  async execute(): Promise<void> {
    const data = this.array;
    await this.store.putAll(data, this);
    await super.execute();
  }
}
