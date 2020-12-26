import { Driver } from '../driver/driver';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractBrowser {
	public needProxyRotation: boolean;
	public proxies: string[] = [];
	public windowWidth = 1920;
	public windowHeight = 1080;
	public language = 'en';

	public abstract create(): Promise<Driver>;
	public abstract abort(): Promise<void>;
	public abstract destroy(): Promise<void>;
	public abstract hasBeenDestroyed(): boolean;
	public abstract hasBeenAborted(): boolean;
}

