export abstract class LineDataParser {

  protected static LINE_MACROS_PATTERN = /\{\$line\.([^}.]+)\}/gi;

  public static hasAnyMacros(input: string): boolean {
    return this.LINE_MACROS_PATTERN.test(input);
  }
}
