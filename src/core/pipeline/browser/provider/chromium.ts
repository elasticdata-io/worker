import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';

@Injectable()
export class Chromium extends AbstractBrowser {
	async create(): Promise<Driver> {
		// const args = await puppeteer.defaultArgs()
		//   .filter(flag => flag !== '--enable-automation')
		//   .filter(flag => flag !== '--headless');
		// const browser: Browser = await puppeteer.launch({
		// 	headless: false,
		// 	defaultViewport: null,
		// 	ignoreDefaultArgs: true,
		// 	args: args,
		// });
		const browser = await puppeteer.launch();
		return new ChromiumDriver(browser);
	}
}
