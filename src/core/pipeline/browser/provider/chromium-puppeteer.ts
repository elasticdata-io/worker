import { AbstractBrowser } from '../abstract-browser';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';
import {inject} from "inversify";
import {TYPES as ROOT_TYPES} from "../../types";
import {PipelineIoc} from "../../pipeline-ioc";
import * as genericPool from "generic-pool";
import {ChromiumPageFactory} from "./chromium-page-factory";
import {PageFactoryOptions} from "../model/page-factory-options";
import {Pool} from "generic-pool";
import {Browser, Page} from "puppeteer";

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {

	private _driver: Driver;

	constructor(
		@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		super();
	}

	public async create(): Promise<Driver> {
		try {
			const proxies = this.proxies || [];
			const options = {
				proxies,
				windowWidth: this.windowWidth,
				windowHeight: this.windowHeight,
				language: this.language,
			} as PageFactoryOptions;
			console.log(options);
			const pageFactory = new ChromiumPageFactory(options);
			const opts = {
				max: 4,
				min: 1
			};
			const pool: Pool<{page: Page, browser: Browser}> = genericPool.createPool(pageFactory, opts);
			this._driver = new ChromiumDriver(pool, this._ioc);
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
