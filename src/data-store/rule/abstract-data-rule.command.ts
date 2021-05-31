import DataRuleDto from "../dto/data-rule.dto";

export type KeyStrategy = 'afterInsert' | 'beforeCommit';

export default abstract class AbstractDataRuleCommand {

    constructor(protected config: DataRuleDto) {}

    public get keyStrategy() : KeyStrategy {
        return 'afterInsert';
    }
    protected abstract transformString(inputValue: string, document: object): void;
    protected abstract transformArray(inputValue: any[], document: object): void;
    protected setToKey(document: any, newValue: string | string[]): void {
        const key = this.config.toKey || this.config.bindKey;
        document[key] = newValue;
    }

    public applyAfterInsert(inputKey: string, inputValue: string, document: object): void {
        if (!this.isWatchKey(inputKey)) {
            return;
        }
        if (inputValue === undefined || inputValue === null) {
            return;
        }
        if (Array.isArray(inputValue)) {
            this.transformArray(inputValue, document);
        }
        if (typeof inputValue === 'string') {
            this.transformString(inputValue, document);
        }
    };

    public applyBeforeCommit(document: object): void {
        return;
    }

    public isWatchKey(key: string): boolean {
        return this.config.bindKey === key;
    }
}
