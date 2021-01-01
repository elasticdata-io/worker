import AbstractDataRuleCommand from "../abstract-data-rule.command";

export default class UniqueRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        return
    }

    protected transformArray(inputValue: string[], document: object): void {
        const outputValue = inputValue.filter(this._onlyUnique);
        this.setToKey(document, outputValue);
    }

    private _onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

}
