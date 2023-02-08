import { AbstractBrowser } from '../abstract-browser';
import { Injectable } from '@nestjs/common';
import { Driver } from '../../driver/driver';
import { ChromiumDriver } from '../../driver/chromium-driver';
import { inject } from 'inversify';
import { TYPES as ROOT_TYPES } from '../../types';
import { PipelineIoc } from '../../pipeline-ioc';
import * as genericPool from 'generic-pool';
import { ChromiumPageFactory } from './chromium-page-factory';
import { PageFactoryOptions } from '../model/page-factory-options';
import { Pool } from 'generic-pool';
import { Browser, Page } from 'puppeteer';
import { Environment } from '../../environment';

@Injectable()
export class ChromiumPuppeteer extends AbstractBrowser {
  private _driver: Driver;

  constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
    super();
  }

  public async create(): Promise<Driver> {
    try {
      const proxies = this.needProxyRotation ? this.proxies : [];
      const options = {
        proxies,
        windowWidth: this.windowWidth,
        windowHeight: this.windowHeight,
        language: this.language,
        network: this.network,
      } as PageFactoryOptions;
      console.info(options);
      const env = this._ioc.get<Environment>(ROOT_TYPES.Environment);
      const pageFactory = new ChromiumPageFactory(options, env);
      const maxTabs: number = parseInt(process.env.MAX_CHROME_TABS) || 3;
      const opts = {
        max: maxTabs,
        min: 1,
      };
      const pool: Pool<{ page: Page; browser: Browser }> =
        genericPool.createPool(pageFactory, opts);
      this._ioc
        .bind<Pool<{ page: Page; browser: Browser }>>(ROOT_TYPES.BrowserPool)
        .toConstantValue(pool);
      this._driver = new ChromiumDriver(this._ioc);
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

  public async abort(): Promise<void> {
    await this._driver.abort();
  }

  public async destroy(): Promise<void> {
    await this._driver.destroy();
  }

  public hasBeenDestroyed(): boolean {
    return Boolean(this._driver.hasBeenDestroyed());
  }

  public hasBeenAborted(): boolean {
    return Boolean(this._driver.hasBeenAborted());
  }
}
