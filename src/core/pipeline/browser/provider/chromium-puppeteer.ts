import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {
	async create(): Promise<Driver> {
		try {
			const args = await puppeteer.defaultArgs();
			if (this.windowWidth && this.windowHeight) {
				args.push(`--window-size=${this.windowWidth},${this.windowHeight}`);
			} else {
				args.push('--start-maximized');
				args.push('--start-fullscreen');
			}
			if (this.language) {
				args.push(`--lang=${this.language}`);
			}
			if (this.proxy) {
				args.push(`--proxy-server=${this.proxy}`);
			}
			const browser = await puppeteer.launch({
				headless: true,
				ignoreDefaultArgs: ['--enable-automation', '--no-sandbox'],
				args: args
			});
			const driver = new ChromiumDriver(browser);
			await driver.init({
				width: this.windowWidth,
				height: this.windowHeight,
				language: this.language,
			});
			return driver;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
