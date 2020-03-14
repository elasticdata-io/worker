import { AbstractBrowser } from '../abstract-browser';
import { IDriver } from '../../driver/i-driver';
import * as puppeteer from 'puppeteer';
import { ChromiumDriver } from '../../driver/chromium-driver';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Chromium extends AbstractBrowser {
	async create(): Promise<IDriver> {
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
