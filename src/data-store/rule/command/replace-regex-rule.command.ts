import AbstractDataRuleCommand from "../abstract-data-rule.command";

export default class ReplaceRegexRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        const config = this.config as any;
        const searchRegex = config.searchRegex;
        const replaceValue = config.replaceValue;
        const outputValue = inputValue.toString().replace(new RegExp(searchRegex, 'gi'), replaceValue);
        this.setToKey(document, outputValue);
    }

    protected transformArray(inputValue: string[], document: object): void {
        const config = this.config as any;
        const searchRegex = config.searchRegex;
        const replaceValue = config.replaceValue;
        const outputValue = inputValue.map(x => x.replace(new RegExp(searchRegex, 'gi'), replaceValue));
        this.setToKey(document, outputValue);
    }

}
