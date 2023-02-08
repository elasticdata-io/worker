import AbstractDataRuleCommand from '../abstract-data-rule.command';

export class ReplaceRuleCommand extends AbstractDataRuleCommand {
  protected transformString(inputValue: string, document: object): void {
    const config = this.config as any;
    const oldValue = config.oldValue;
    const newValue = config.newValue;
    const outputValue = inputValue.toString().replace(oldValue, newValue);
    this.setToKey(document, outputValue);
  }

  protected transformArray(inputValue: string[], document: object): void {
    const config = this.config as any;
    const oldValue = config.oldValue;
    const newValue = config.newValue;
    const outputValue = inputValue.map((x) => x.replace(oldValue, newValue));
    this.setToKey(document, outputValue);
  }
}
