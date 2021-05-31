import AbstractDataRuleCommand from "../abstract-data-rule.command";

export class JoinRuleCommand extends AbstractDataRuleCommand {

    protected transformString(inputValue: string, document: object): void {
        return;
    }

    protected transformArray(inputValue: string[], document: object): void {
        const config = this.config as any;
        const separator = config.separator;
        const outputValue = inputValue.join(separator);
        this.setToKey(document, outputValue);
    }
}
