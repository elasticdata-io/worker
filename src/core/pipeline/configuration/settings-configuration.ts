import { SettingsWindowConfiguration } from './settings-window-configuration';

export class SettingsConfiguration {
  /**
   * Max working pipeline in seconds
   */
  public maxWorkingMinutes: number;

  /**
   * Browser window configuration
   */
  public window: SettingsWindowConfiguration;
}
