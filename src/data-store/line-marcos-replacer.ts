export abstract class LineMarcosReplacer {
	public static readonly LINE_MACROS_PATTERN = '(\\{\\$line\\.([^}.]+)\\})';

	public static hasAnyMacros(input: string): boolean {
		const pattern = new RegExp(LineMarcosReplacer.LINE_MACROS_PATTERN, 'gi').compile();
		return pattern.test(input);
	}

	public static replaceMacros(input: string, line: any): any {
		const value = input.replace(/\{\$line\.([^}.]+)\}/gi, (match, token) => line[token]);
		if (value === 'undefined' || value === undefined) {
			return '';
		}
		if (value === 'null' || value === null) {
			return '';
		}
		return value;
	}
}
