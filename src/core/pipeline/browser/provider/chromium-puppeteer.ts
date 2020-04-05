import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {

	private _driver: Driver;

	async create(): Promise<Driver> {
		try {
			const args = await puppeteer.defaultArgs()
			  .filter(x => x !== '--enable-automation');
			args.push('--no-sandbox');
			args.push('--disable-setuid-sandbox');
			if (this.windowWidth && this.windowHeight) {
				args.push(`--window-size=${this.windowWidth},${this.windowHeight}`);
			}
			if (this.language) {
				args.push(`--lang=${this.language}`);
			}
			const proxies = this.proxies || [];
			if (proxies.length) {
				args.push(`--proxy-server=${proxies[0]}`);
			}
			// console.log(args);
			const browser = await puppeteer.launch({
				headless: true,
				ignoreDefaultArgs: ['--enable-automation' /*'--no-sandbox'*/],
				args: args,
			});
			this._driver = new ChromiumDriver(browser);
			await this._driver.init({
				width: this.windowWidth,
				height: this.windowHeight,
				language: this.language,
				proxies: proxies,
			});
			return this._driver;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}

	async stop(): Promise<void> {
		await this._driver.exit()
	}

	isStopped(): boolean {
		return this._driver.hasBeenExited();
	}
}
