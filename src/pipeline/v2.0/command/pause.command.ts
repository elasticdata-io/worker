import { AbstractCommand } from '../../command/abstract-command';
import { Cmd } from '../../command/decorator/command.decorator';
import { Assignable } from '../../command/decorator/assignable.decorator';
import { CommandType } from '../../documentation/specification';

@Cmd({
  cmd: 'pause',
  version: '2.0',
  type: CommandType.OTHER,
  summary: `doc.PAUSE.SUMMARY`,
})
export class PauseCommand extends AbstractCommand {
  @Assignable({ required: false, type: Number, default: 5 })
  public timeout = 5;

  async execute(): Promise<void> {
    await this.driver.pause(this);
    await super.execute();
  }
}
