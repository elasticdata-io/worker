import { injectable } from "inversify";
import { UserInteractionSettingsConfiguration } from "../configuration/settings-configuration";

@injectable()
export class UserInteractionInspector {

	public userInteraction: UserInteractionSettingsConfiguration;

	public checkNeedInteraction(): Promise<boolean> {
		console.log(JSON.stringify(this.userInteraction));
		return Promise.resolve(false);
	}

	public waitUserConfirmation(): Promise<void> {
		return new Promise(function(resolve) {
			setTimeout(resolve, 10 * 1000);
		});
	}
}
