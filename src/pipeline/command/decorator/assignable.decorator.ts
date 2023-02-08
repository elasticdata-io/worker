import * as App from '../../documentation/specification';
import { AbstractCommand } from '../abstract-command';

export function Assignable(config: {
  type: any | any[];
  required?: boolean;
  summary?: string;
  default: any;
}) {
  const decorator = function (target: AbstractCommand, key: string | symbol) {
    let command = App.DOCUMENTATION.commands.find(
      (x) => x.$class === target.constructor.name,
    );
    if (!command) {
      App.DOCUMENTATION.commands.push({
        $class: target.constructor.name,
        version: null,
        cmd: null,
        type: null,
        props: [],
      });
      command = App.DOCUMENTATION.commands.find(
        (x) => x.$class === target.constructor.name,
      );
    }
    const type = Array.isArray(config.type)
      ? config.type.map((x) => x.name || x.toString())
      : config.type.name || config.type.toString();
    command.props.push({
      name: key.toString(),
      required: config?.required === undefined ? true : config?.required,
      summary: config?.summary,
      type: type,
      default: config?.default,
    });
  };
  return decorator;
}
