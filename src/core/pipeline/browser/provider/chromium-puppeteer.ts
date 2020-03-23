import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {
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
			console.log(args);
			const browser = await puppeteer.launch({
				headless: true,
				ignoreDefaultArgs: ['--enable-automation' /*'--no-sandbox'*/],
				args: args,
			});
			const driver = new ChromiumDriver(browser);
			await driver.init({
				width: this.windowWidth,
				height: this.windowHeight,
				language: this.language,
				proxies: proxies,
			});
			return driver;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
