import { ContextValidator } from './context-validator';

export class StorageService {

	private readonly _contexts: any;

	constructor() {
		this._contexts = {};
	}

	public async put(key: string, value: string, context: string): Promise<void> {
		ContextValidator.validate(context);
		await this.upsertLine(context, key, value);
	}
	public async getDocument(): Promise<any> {
		return this._contexts;
	}

	private async upsertLine(context: string, key: string, value: string): Promise<void> {
		if (!this._contexts[context]) {
			this._contexts[context] = [];
		}
		return this._upsertLine(context, key, value);
	}
	private async _upsertLine(context: string, key: string, value: string): Promise<void> {
		const lines = this._contexts[context];
		const lineIndex = lines.length === 0
		  	? 0
			: lines.length - 1;
		const line = lines.length && lines[lineIndex];
		if (line && !line[key]) {
			this._contexts[context][lineIndex][key] = value;
			return
		}
		lines.push({[key]: value});
	}
}
