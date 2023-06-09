import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Response,
} from '@nestjs/common';
import { FilePersistenceService } from '../../persistence/file';
import { Response as Res } from 'express';
import { Readable } from 'node:stream';

@Controller('/v1/objects')
export class FileStorageController {
  constructor(
    private readonly filePersistenceService: FilePersistenceService,
  ) {}

  @Get()
  async fileByName(
    @Query('name') fileName: string,
    @Response() res: Res,
  ): Promise<void> {
    // todo: performance: read from db in stream.
    const file = await this.filePersistenceService.findOneByName(
      decodeURIComponent(fileName),
    );
    if (!file) {
      throw new NotFoundException(`Object with name:${fileName} not present`);
    }
    res.set(file.headers);
    const stream = Readable.from([file.content]);
    stream.pipe(res);
  }

  @Get(':fileUuid')
  async file(
    @Param('fileUuid') fileUuid: string,
    @Response() res: Res,
  ): Promise<void> {
    // todo: performance: read from db in stream.
    const file = await this.filePersistenceService.findOne(fileUuid);
    if (!file) {
      throw new NotFoundException(`Object with id:${fileUuid} not present`);
    }
    res.set(file.headers);
    const stream = Readable.from([file.content]);
    stream.pipe(res);
  }
}
