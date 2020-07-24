export abstract class LineDataParser {

  public static readonly LINE_MACROS_PATTERN = '\\{\\$line\\.([^}.]+)\\}';

  public static hasAnyMacros(input: string): boolean {
    const pattern = new RegExp(LineDataParser.LINE_MACROS_PATTERN, 'gi').compile();
    return pattern.test(input);
  }
}
