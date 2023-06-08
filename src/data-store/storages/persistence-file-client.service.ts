import { AbstractFileClientService } from '../abstract-file-client.service';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { BucketService } from '../../persistence/bucket';
import { FileService } from '../../persistence/file';

@Injectable()
export class PersistenceFileClientService extends AbstractFileClientService {
  public constructor(
    private readonly bucketService: BucketService,
    private readonly fileService: FileService,
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
    // todo: get url of file
    return 'file://' + path.join(userUuid, objectName);
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
