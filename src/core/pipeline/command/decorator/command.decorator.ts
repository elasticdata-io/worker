import * as App from '../../documentation/specification';

export function Cmd(config: { cmd: string, version: string }) {
  return (ctor: Function) => {
    const command = App.DOCUMENTATION.commands.find(x => x.$class === ctor.name);
    if (command) {
      command.version = config.version;
      command.cmd = config.cmd;
    } else {
      App.DOCUMENTATION.commands.push({
        $class: ctor.name,
        cmd: config.cmd,
        version: config.version,
        props: []
      });
    }
  }
}
