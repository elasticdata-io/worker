export abstract class LineMacrosParser {

  public static readonly LINE_MACROS_PATTERN = '\\{\\$line\\.([^}.]+)\\}';

  public static hasAnyMacros(input: string): boolean {
    const pattern = new RegExp(LineMacrosParser.LINE_MACROS_PATTERN, 'gi').compile();
    return pattern.test(input);
  }
}
