export class SettingsWindowConfiguration {
  public width: number;
  public height: number;

  /**
   * Browser language
   */
  public language: string;

  /**
   * User interaction configuration with watch selectors.
   */
  public userInteraction: { watchSelectors: string[] };
}
