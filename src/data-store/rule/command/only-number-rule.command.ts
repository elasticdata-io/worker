import AbstractDataRuleCommand from "../abstract-data-rule.command";

export default class OnlyNumberRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        const outputValue = inputValue.toString().replace(/[^0-9]/g, '');
        this.setToKey(document, outputValue);
    }

    protected transformArray(inputValue: string[], document: object): void {
        const outputValue = inputValue.map(x => x.replace(/[^0-9]/g, ''));
        this.setToKey(document, outputValue);
    }

}
