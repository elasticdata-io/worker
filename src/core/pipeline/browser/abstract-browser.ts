import { Driver } from '../driver/driver';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractBrowser {
	public proxies: string[];
	public windowWidth = 1920;
	public windowHeight = 1080;
	public language = 'en';

	public abstract create(): Promise<Driver>;
}

