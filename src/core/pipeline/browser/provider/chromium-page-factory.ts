import {BrowserPageFactory} from "../browser-page-factory";
import {Browser, Page} from "puppeteer";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import {PageFactoryOptions} from "../model/page-factory-options";

export class ChromiumPageFactory implements BrowserPageFactory {

	constructor(private _config: PageFactoryOptions) {}

	async create(): Promise<{page: Page, browser: Browser}> {
		puppeteer.use(
			RecaptchaPlugin({
				provider: {
					id: '2captcha',
					token: '868e274d75df7a72cb05d1eeb8bc05cb', // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
				},
				visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
			})
		);
		const config = this._config;
		let args = await puppeteer.defaultArgs()
			.filter(x => x !== '--enable-automation');
		args.push('--no-sandbox');
		args.push('--disable-setuid-sandbox');
		args = [
			...args,
			'--disable-dev-shm-usage',
			'--disable-canvas-aa', // Disable antialiasing on 2d canvas
			'--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
			'--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
			'--disable-dev-shm-usage', // ???
			'--no-zygote', // wtf does that mean ?
			'--use-gl=swiftshader', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
			'--enable-webgl',
			'--hide-scrollbars',
			'--mute-audio',
			'--no-first-run',
			'--disable-infobars',
			'--disable-breakpad',
			'--disable-web-security',
			'--disable-features=IsolateOrigins,site-per-process',
			//'--ignore-gpu-blacklist'
		]
		if (config.windowWidth && config.windowHeight) {
			args.push(`--window-size=${config.windowWidth},${config.windowHeight}`);
		}
		if (config.language) {
			args.push(`--lang=${config.language}`);
		}
		if (config.proxies.length) {
			args.push(`--proxy-server=${config.proxies[0]}`);
		}
		let browser: Browser;
		const headless = process.env.PUPPETEER_HEADLESS === undefined || process.env.PUPPETEER_HEADLESS === '1';
		console.log(`process.env.PUPPETEER_HEADLESS = ${process.env.PUPPETEER_HEADLESS}`);
		if (headless) {
			browser = await puppeteer.launch({
				headless: headless,
				ignoreDefaultArgs: [
					'--enable-automation',
					/*'--no-sandbox'*/
					'--enable-automation',
					'--disable-extensions',
				],
				args: args,
			});
		} else {
			const args = await puppeteer.defaultArgs()
				.filter(flag => flag !== '--enable-automation')
				.filter(flag => flag !== '--headless');
			if (config.windowWidth && config.windowHeight) {
				args.push(`--window-size=${config.windowWidth},${config.windowHeight}`);
			}
			if (config.language) {
				args.push(`--lang=${config.language}`);
			}
			if (config.proxies.length) {
				args.push(`--proxy-server=${config.proxies[0]}`);
			}
			browser = await puppeteer.launch({
				args: args,
				headless: false,
				devtools: false,
				defaultViewport: null,
				ignoreDefaultArgs: [
					'--enable-automation',
					'--disable-extensions',
				],
			});
		}
		const page = await this._createNewPage(browser);
		return {
			browser,
			page,
		};
	}

	public async destroy(resource: {page: Page, browser: Browser}): Promise<void> {
		console.log(`destroy resource`)
		await resource.browser.close();
	}

	private async _createNewPage(browser: Browser): Promise<Page> {
		const config = this._config;
		const pages = await browser.pages();
		const page = pages[0];
		if (config && config.windowWidth) {
			await page.setViewport({
				width: config.windowWidth,
				height: config.windowHeight
			});
		}
		if (config && config.language) {
			await page.setExtraHTTPHeaders({
				'Accept-Language': config.language
			});
		}
		return page;
	}

}
