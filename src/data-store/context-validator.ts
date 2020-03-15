export abstract class ContextValidator {

	/**
	 * Validate context string.
	 * Throw error if context is invalid.
	 * @param {String} context
	 */
	static validate(context: string): void {
		const isRoot = /^root$/gi.test(context);
		if (isRoot) {
			return;
		}
		let correct = /^root\./gi.test(context);
		if (correct) {
			correct = /[a-zа-я0-9_\-.]/gi.test(context);
		}
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
