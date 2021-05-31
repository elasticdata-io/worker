import AbstractDataRuleCommand from "../abstract-data-rule.command";

export class TrimRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        const outputValue = inputValue.toString().trim();
        this.setToKey(document, outputValue);
    }

    protected transformArray(inputValue: string[], document: object): void {
        const outputValue = inputValue.map(x => x.trim());
        this.setToKey(document, outputValue);
    }

}
