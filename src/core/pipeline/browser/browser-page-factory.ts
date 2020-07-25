import {Browser, Page} from "puppeteer";

export interface BrowserPageFactory {

	create(): Promise<{page: Page, browser: Browser}>;
	destroy(resource: {page: Page, browser: Browser}): Promise<void>;
}
