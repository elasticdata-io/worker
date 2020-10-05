import {UserInteractionSettingsConfiguration} from "../configuration/settings-configuration";

export class DriverOptions {
	width: number;
	height: number;
	language: string;
	proxies: string[];
	userInteraction: UserInteractionSettingsConfiguration;
}
