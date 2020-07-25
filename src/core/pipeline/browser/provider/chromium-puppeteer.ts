import { AbstractBrowser } from '../abstract-browser';
import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';
import {inject} from "inversify";
import {TYPES as ROOT_TYPES} from "../../types";
import {PipelineIoc} from "../../pipeline-ioc";

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {

	private _driver: Driver;

	constructor(
		@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
	}

	public async create(): Promise<Driver> {
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
			let browser;
			const headless = process.env.PUPPETEER_HEADLESS === undefined || process.env.PUPPETEER_HEADLESS === '1';
			if (headless) {
				browser = await puppeteer.launch({
					headless: headless,
					ignoreDefaultArgs: ['--enable-automation' /*'--no-sandbox'*/],
					args: args,
				});
			} else {
				browser = await puppeteer.launch({
					headless: headless,
				});
			}
			this._driver = new ChromiumDriver(browser, this._ioc);
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

	public async stop(): Promise<void> {
		await this._driver.exit()
	}

	public isStopped(): boolean {
		return this._driver.hasBeenExited();
	}
}
