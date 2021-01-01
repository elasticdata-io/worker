import AbstractDataRuleCommand from "../abstract-data-rule.command";

export default class SplitRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        const config = this.config as any;
        const delimiter = config.delimiter;
        const outputValue = inputValue.toString().split(delimiter);
        this.setToKey(document, outputValue);
    }

    protected transformArray(inputValue: string[], document: object): void {
        return;
    }

}
