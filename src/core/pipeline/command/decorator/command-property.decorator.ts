import { AbstractCommand } from '../abstract-command';

export function CmdProperty() {
    return function(target: AbstractCommand, key: string | symbol) {
      let val = target[key];
      const getter = () =>  val;
      const setter = (next) => {
        val = next;
      };
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
  };
}
