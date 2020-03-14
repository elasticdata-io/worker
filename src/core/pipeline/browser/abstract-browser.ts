import { IDriver } from '../driver/i-driver';

export abstract class AbstractBrowser {
	public enableImage = true;
	public isDebugMode = false;
	public proxy: string;
	public windowWidth = 1920;
	public windowHeight = 1080;
	public language = 'en';

	public abstract create(): Promise<IDriver>;
}

