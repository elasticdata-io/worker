import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './env.configuration';

@Injectable()
export class EnvConfigurationService extends EnvConfiguration {
	constructor(private readonly configService: ConfigService) {
		super();
	}

	get USE_ISOLATION_MODE(): boolean {
		return this.configService.get<string>('USE_ISOLATION_MODE') === '1';
	}

	get APP_MINIO_ACCESS_KEY(): string {
		return this.configService.get<string>('APP_MINIO_ACCESS_KEY');
	}

	get APP_MINIO_END_POINT(): string {
		return this.configService.get<string>('APP_MINIO_END_POINT');
	}

	get APP_MINIO_PORT(): number {
		return this.configService.get<number>('APP_MINIO_PORT');
	}

	get APP_MINIO_SECRET_KEY(): string {
		return this.configService.get<string>('APP_MINIO_SECRET_KEY');
	}

	get APP_MINIO_USE_SSL(): boolean {
		return this.configService.get<boolean>('APP_MINIO_USE_SSL');
	}

	get SCRAPER_SERVICE_URL(): string {
		return this.configService.get<string>('SCRAPER_SERVICE_URL');
	}
}