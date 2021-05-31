import AbstractDataRuleCommand from "../abstract-data-rule.command";

export class ExtractRegexRuleCommand extends AbstractDataRuleCommand {

    protected transformArray(inputValue: string[], document: object): void {
        const config = this.config as any;
        const regex = config.regex;
        const replacement = config.replacement;
        const outputValue = this._replaceArray(inputValue, replacement, regex);
        this.setToKey(document, outputValue);
    }

    protected transformString(inputValue: string, document: object): void {
        const config = this.config as any;
        const regex = config.regex;
        const replacement = config.replacement;
        const outputValue = this._replaceString(inputValue, replacement, regex);
        this.setToKey(document, outputValue);
    }

    private _replaceString(inputValue: any, replacement: string, regex: string): string {
        const matches = inputValue.toString().match(new RegExp(regex, 'i')) || {groups: {}};
        const groups = matches.groups;
        return groups[replacement];
    }

    private _replaceArray(inputValue: string[], replacement: string, regex: string): string[] {
        return inputValue.map(input => this._replaceString(input, replacement, regex));
    }

}
