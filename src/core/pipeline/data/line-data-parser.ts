export abstract class LineDataParser {

  protected static LINE_MACROS_PATTERN = /\{\$line\.([0-9a-zа-я_-]+)?\}/gi;

  public static hasAnyMacros(input: string): boolean {
    return this.LINE_MACROS_PATTERN.test(input);
  }
}
