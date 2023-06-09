import { AbstractFileClientService } from '../../abstract-file-client.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalFileClientService extends AbstractFileClientService {
  private tmpFolder = process.env.TMP_FOLDER || '/tmp';

  async bucketExists(bucket: string): Promise<boolean> {
    return fs.existsSync(path.join(this.tmpFolder, bucket));
  }

  async makeBucket(bucket: string, region: string): Promise<void> {
    fs.mkdirSync(path.join(this.tmpFolder, bucket));
  }

  async presignedGetObject(
    userUuid: string,
    objectName: string,
  ): Promise<string> {
    return 'file://' + path.join(this.tmpFolder, userUuid, objectName);
  }

  async putObject(
    userUuid: string,
    objectName: string,
    file: Buffer,
    metadata?: object,
  ): Promise<void> {
    const filePath = path.join(this.tmpFolder, userUuid, objectName);
    if (fs.existsSync(filePath)) {
      return;
    }
    fs.writeFileSync(filePath, file, { encoding: 'utf-8' });
  }
}
