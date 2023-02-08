import AbstractDataRuleCommand, {
  KeyStrategy,
} from '../abstract-data-rule.command';

export class PluckRuleCommand extends AbstractDataRuleCommand {
  public get keyStrategy(): KeyStrategy {
    return 'beforeCommit';
  }

  public applyBeforeCommit(document: object): void {
    const isWatched = Object.keys(document).find((key) => this.isWatchKey(key));
    if (!isWatched) {
      return;
    }
    const config = this.config as any;
    const keys = config.bindKey.split('.');
    let values: Array<object | string | number> | object = { ...document };
    function getValue(
      doc: Array<object | string | number> | object,
      key: string,
    ) {
      if (Array.isArray(doc)) {
        const value = [...doc.map((x) => x[key])];
        return value.flat();
      }
      return doc[key];
    }
    keys.forEach((key) => {
      values = getValue(values, key);
    });
    const toKey = config.toKey || keys.shift();
    document[toKey] = values as Array<any>;
  }

  public isWatchKey(key: string): boolean {
    return (
      this.config.bindKey === key || this.config.bindKey.startsWith(`${key}.`)
    );
  }

  public applyAfterInsert(
    inputKey: string,
    inputValue: string | Array<any>,
    document: object,
  ): void {
    throw 'not supported applyAfterInsert of PluckRuleCommand class';
  }

  protected transformArray(inputValue: Array<any>, document: object): void {
    throw 'not supported transformArray of PluckRuleCommand class';
  }

  protected transformString(inputValue: string, document: object): void {
    throw 'not supported transformString of PluckRuleCommand class';
  }
}
