import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {
	async create(): Promise<Driver> {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				ignoreDefaultArgs: ['--enable-automation', '--no-sandbox'],
			});
			return new ChromiumDriver(browser);
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
