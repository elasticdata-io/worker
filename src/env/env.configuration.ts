import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class EnvConfiguration {
  abstract get USE_ALIVE_PROBE(): boolean;
  abstract get USE_INNER_PERSISTENCE(): boolean;
  abstract get USE_ISOLATION_MODE(): boolean;
  abstract get APP_MINIO_END_POINT(): string;
  abstract get APP_MINIO_PORT(): number;
  abstract get APP_MINIO_USE_SSL(): boolean;
  abstract get APP_MINIO_ACCESS_KEY(): string;
  abstract get APP_MINIO_SECRET_KEY(): string;
  abstract get SCRAPER_SERVICE_URL(): string;
}
