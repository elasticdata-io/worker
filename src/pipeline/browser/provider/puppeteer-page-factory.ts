import { BrowserPageFactory } from '../browser-page-factory';
import { Browser, Page } from 'puppeteer';
import * as proxyChain from 'proxy-chain';
import { executablePath } from 'puppeteer';
// import * as puppeteer from "puppeteer";
// import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { PageFactoryOptions } from '../model/page-factory-options';
import { Environment } from '../../environment';

import puppeteer from 'puppeteer-extra';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as StealthPlugin from 'puppeteer-extra-plugin-stealth';

export class PuppeteerPageFactory implements BrowserPageFactory {
  private static USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36`;

  constructor(private _config: PageFactoryOptions, private _env: Environment) {}

  async create(): Promise<{ page: Page; browser: Browser }> {
    // todo: encapsulation this use declaration
    // puppeteer.use(
    // 	RecaptchaPlugin({
    // 		provider: {
    // 			id: '2captcha',
    // 			token: '868e274d75df7a72cb05d1eeb8bc05cb', // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    // 		},
    // 		visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
    // 	})
    // );
    const config = this._config;
    const args = [];
    args.push('--no-sandbox');
    // args.push('--disable-setuid-sandbox');
    /**
     args = [
     ...args,
     '--disable-dev-shm-usage',
     '--disable-canvas-aa', // Disable antialiasing on 2d canvas
     '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
     '--disable-gl-drawing-for-test', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but test will run faster.
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
     ];
     **/
    if (config.windowWidth && config.windowHeight) {
      args.push(`--window-size=${config.windowWidth},${config.windowHeight}`);
    }
    if (config.language) {
      args.push(`--lang=${config.language}`);
    }
    if (config.proxies.length) {
      const proxy = config.proxies[0];
      args.push(`--proxy-server=${proxy}`);
    }
    // args.push(`--user-agent=${this._getUserAgent()}`);
    let browser: Browser;
    const headless =
      process.env.PUPPETEER_HEADLESS === undefined ||
      process.env.PUPPETEER_HEADLESS === '1';
    console.log(
      `process.env.PUPPETEER_HEADLESS = ${process.env.PUPPETEER_HEADLESS}`,
    );
    if (headless) {
      try {
        browser = await puppeteer.use(StealthPlugin()).launch({
          userDataDir: './profile',
          executablePath: executablePath(),
          headless: headless,
          ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'],
          args: args,
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }
    if (false == headless) {
      // const args = []
      //   .filter((flag) => flag !== '--enable-automation')
      //   .filter((flag) => flag !== '--headless');
      const args = [];
      if (config.windowWidth && config.windowHeight) {
        args.push(`--window-size=${config.windowWidth},${config.windowHeight}`);
      }
      if (config.language) {
        args.push(`--lang=${config.language}`);
      }
      if (config.proxies.length) {
        args.push(`--proxy-server=${config.proxies[0]}`);
      }
      // args.push(`-–disable-images`);
      // args.push(`--user-agent=${this._getUserAgent()}`);
      try {
        browser = await puppeteer.use(StealthPlugin()).launch({
          args: args,
          executablePath: executablePath(),
          headless: false,
          devtools: false,
          defaultViewport: null,
          ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'],
        });
      } catch (err) {
        console.error(err);
        process.exit(1);
      }
    }
    try {
      const page = await this._createNewPage(browser);
      await page.authenticate({
        username: 'bombascter',
        password: '!Priosner31!',
      });
      await page.setUserAgent(
        `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:107.0) Gecko/20100101 Firefox/107.0`,
      );
      return {
        browser,
        page,
      };
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  public async destroy(resource: {
    page: Page;
    browser: Browser;
  }): Promise<void> {
    console.log(`destroy resource`);
    await resource.browser.close();
  }

  private async _createNewPage(browser: Browser): Promise<Page> {
    const config = this._config;
    const pages = await browser.pages();
    const page = pages[0];
    if (config && config.windowWidth) {
      await page.setViewport({
        width: config.windowWidth,
        height: config.windowHeight,
      });
    }
    if (config && config.language) {
      await page.setExtraHTTPHeaders({
        'Accept-Language': config.language,
      });
    }
    await this.addNetworkInterception(page);
    return page;
  }

  private async addNetworkInterception(page: Page) {
    const skipResources = this._config?.network?.skipResources || {
      font: false,
      stylesheet: false,
      image: false,
    };
    const skipResourceTypes = [];
    if (skipResources.font) {
      skipResourceTypes.push('font');
    }
    if (skipResources.stylesheet) {
      skipResourceTypes.push('stylesheet');
    }
    if (skipResources.image) {
      skipResourceTypes.push('image');
    }
    if (skipResourceTypes.length === 0) {
      return;
    }
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (skipResourceTypes.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  private _getUserAgent(): string {
    return `${PuppeteerPageFactory.USER_AGENT}==${this._env.taskId}`;
  }
}
