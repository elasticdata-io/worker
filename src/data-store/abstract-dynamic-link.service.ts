export abstract class AbstractDynamicLinkService {
	public abstract getHumanLink(absoluteUrl: string): Promise<string>;
}