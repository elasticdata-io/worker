import { AbstractFileClientService } from '../../abstract-file-client.service';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { BucketPersistenceService } from '../../../persistence/bucket';
import { FilePersistenceService } from '../../../persistence/file';
import { EnvConfiguration } from '../../../env/env.configuration';
import { urlencoded } from "express";

@Injectable()
export class PersistenceFileClientService extends AbstractFileClientService {
  public constructor(
    private readonly bucketService: BucketPersistenceService,
    private readonly fileService: FilePersistenceService,
    private readonly envConfiguration: EnvConfiguration,
  ) {
    super();
  }

  async bucketExists(userUuid: string): Promise<boolean> {
    const result = await this.bucketService.findOne(userUuid);
    return Boolean(result);
  }

  async makeBucket(userUuid: string, region: string): Promise<void> {
    const exists = await this.bucketExists(userUuid);
    if (exists === false) {
      await this.bucketService.create(userUuid);
    }
  }

  async presignedGetObject(
    userUuid: string,
    objectName: string,
  ): Promise<string> {
    const prefix = this.envConfiguration.DATA_SERVICE_URL;
    return `${prefix}/v1/objects?name=${encodeURIComponent(objectName)}`;
  }

  async putObject(
    userUuid: string,
    objectName: string,
    file: Buffer,
    metadata?: object,
  ): Promise<void> {
    await this.makeBucket(userUuid, '');
    await this.fileService.create({
      bucketUuid: userUuid,
      name: objectName,
      headers: metadata as Record<string, unknown>,
      content: file,
    });
  }
}
