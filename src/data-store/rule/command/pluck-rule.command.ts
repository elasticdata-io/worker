import AbstractDataRuleCommand from "../abstract-data-rule.command";

export default class PluckRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        return;
    }

    protected transformArray(inputValue: object[], document: object): void {
        const config = this.config as any;
        const innerKey = config.innerKey;
        const merge = config.merge;
        const values = inputValue.map(x => x[innerKey]);
        this.setToKey(document, values);
        if (merge) {
            const result = [];
            for (const value of values) {
                if(Array.isArray(value)) {
                    value.forEach(x => result.push(x));
                }
            }
            this.setToKey(document, result);
        }
    }

}
