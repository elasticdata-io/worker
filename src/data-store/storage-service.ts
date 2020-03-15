export class StorageService {

	private readonly _contexts: any;

	constructor() {
		this._contexts = {};
	}

	public async put(key: string, value: string, context: string): Promise<void> {
		this.validateContext(context);
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
	private validateContext(context: string): void {
		const isRoot = /^root$/gi.test(context);
		if (isRoot) {
			return;
		}
		let correct = /[a-zа-я0-9_\-.]/gi.test(context);
		if (!correct) {
			throw `value of the context: '${context}' is incorrect`;
		}
		const contexts = context.split('.');
		let prevContextIsNumber = true;
		contexts.forEach((context) => {
			if (prevContextIsNumber) {
				correct = /[a-zа-я_\-]/gi.test(context);
			}
			if (!prevContextIsNumber) {
				correct = /[0-9]/gi.test(context);
			}
			prevContextIsNumber = !prevContextIsNumber;
		});
		if (correct) {
			correct = /[^0-9]$/.test(context);
		}
		if (!correct) {
			throw `value of the context: '${context}' is incorrect`;
		}
	}
}
