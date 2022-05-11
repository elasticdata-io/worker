import { AbstractFileClientService } from './abstract-file-client.service';
import * as Minio from 'minio';
import { EnvConfiguration } from '../env/env.configuration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioFileClientService extends AbstractFileClientService {
	private _minioClient: Minio.Client;

	constructor(
		private readonly appEnv: EnvConfiguration,
	) {
		super();
		const options = {
			endPoint: this.appEnv.APP_MINIO_END_POINT,
			port: this.appEnv.APP_MINIO_PORT,
			useSSL: this.appEnv.APP_MINIO_USE_SSL,
			accessKey: this.appEnv.APP_MINIO_ACCESS_KEY,
			secretKey: this.appEnv.APP_MINIO_SECRET_KEY
		};
		this._minioClient = new Minio.Client(options);
	}

	async bucketExists(bucket: string): Promise<boolean> {
		return await this._minioClient.bucketExists(bucket);
	}

	async makeBucket(bucket: string, region: string): Promise<void> {
		await this._minioClient.makeBucket(bucket, region);
	}

	async presignedGetObject(userUuid: string, objectName: string): Promise<string> {
		return await this._minioClient.presignedGetObject(userUuid, objectName);
	}

	async putObject(userUuid: string, objectName: string, file: Buffer, metadata?: object): Promise<void> {
		return await this._minioClient.putObject(userUuid, objectName, file, file.length, metadata);
	}

}