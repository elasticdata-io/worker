import * as App from '../../documentation/specification';
import { CommandType } from '../../documentation/specification';

export function Cmd(config: {
  cmd: string,
  version: string,
  summary?: string,
  type: CommandType
}) {
  return (ctor: Function) => {
    const findCommand = App.DOCUMENTATION.commands.find(x => x.$class === ctor.name);
    const findCommandIndex = App.DOCUMENTATION.commands.indexOf(findCommand);
    const command = {
      props: [],
      ...findCommand,
      version: config.version,
      cmd: config.cmd,
      summary: config?.summary,
      type: config?.type,
      $class: ctor.name,
    }
    if (!findCommand) {
      App.DOCUMENTATION.commands.push(command);
    } else {
      App.DOCUMENTATION.commands[findCommandIndex] = command;
    }
  }
}
