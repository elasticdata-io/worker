import AbstractDataRuleCommand, { KeyStrategy } from '../abstract-data-rule.command';

export class PluckRuleCommand extends AbstractDataRuleCommand {

    public get keyStrategy() : KeyStrategy {
        return 'beforeCommit';
    }

    public applyBeforeCommit(document: object): void {
        const config = this.config as any;
        const keys = config.bindKey.split('.');
        let values: Array<object | string | number> | object = { ...document };
        function getValue(doc: Array<object | string | number> | object, key: string) {
            if (Array.isArray(doc)) {
                const value = [...doc.map(x => x[key])];
                return value.flat();
            }
            return doc[key];
        }
        keys.forEach(key => {
            values = getValue(values, key);
        });
        const toKey = config.toKey || keys.shift();
        document[toKey] = values as Array<any>;
    }

    public applyAfterInsert(inputKey: string, inputValue: string | Array<any>, document: object): void {
        if (!this.isWatchKey(inputKey)) {
            return;
        }
        if (inputValue === undefined || inputValue === null) {
            return;
        }
        if (Array.isArray(inputValue)) {
            this.transformArray(inputValue, document);
        }
    };

    public isWatchKey(key: string): boolean {
        return this.config.bindKey === key || this.config.bindKey.startsWith(`${key}.`);
    }

    protected transformArray(inputValue: Array<any>, document: object): void {
        throw 'not supported transformArray of PluckRuleCommand class';
    }

    protected transformString(inputValue: string, document: object): void {
        throw 'not supported transformString of PluckRuleCommand class';
    }

}
