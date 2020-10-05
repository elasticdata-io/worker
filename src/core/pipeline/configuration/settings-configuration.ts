import { SettingsWindowConfiguration } from './settings-window-configuration';

export interface UserInteractionSettingsConfiguration {
  watchSelectors: string[]
}

export class SettingsConfiguration {
  /**
   * Max working pipeline in seconds
   */
  public maxWorkingMinutes: number;

  /**
   * Browser window configuration
   */
  public window: SettingsWindowConfiguration;

  /**
   * Browser proxies
   */
  public proxies: string[];

  /**
   * User interaction configuration with watch selectors.
   */
  public userInteraction: UserInteractionSettingsConfiguration;
}
