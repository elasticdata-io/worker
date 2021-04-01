export abstract class FunctionParser {

	public static getBody(fn: Function): string {
		const fnString = fn
		  .toString();
		const fnBody = fnString.slice(fnString.indexOf("{") + 1, fnString.lastIndexOf("}"));
		return fnBody;
	}
}
