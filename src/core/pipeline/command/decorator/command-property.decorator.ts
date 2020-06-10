import { AbstractCommand } from '../abstract-command';

export function CommandProperty() {
    return function(target: AbstractCommand, key: string | symbol) {
      let val = target[key];
      const getter = () =>  {
        return val;
      };
      const setter = (next) => {
        console.log('updating flavor...');
        val = `🍦 ${next} 🍦`;
      };
      Object.defineProperty(target, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
  };
}
