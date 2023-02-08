import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { KeyValueData } from './dto/key.value.data';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataResult } from './dto/data.result';
import { CommitDocument } from './dto/commit.document';
import StorageDataRules from './dto/storage-data-rules';
import { KeyData } from './dto/key.data';
import { KeysValuesData } from './dto/keys.values.data';
import { ReplaceMacrosDto } from './dto/replace-macros.dto';

@Controller('/v1/store')
export class DataStoreController {
  constructor(private readonly dataStoreService: DataStoreService) {}

  @Post('append')
  async append(
    @Body() data: KeysValuesData,
    @Headers('useruuid') userUuid: string,
  ): Promise<any> {
    try {
      await this.dataStoreService.putAll({
        ...data,
        userUuid: userUuid,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { success: true };
  }

  @Post()
  async put(
    @Body() data: KeyValueData,
    @Headers('useruuid') userUuid: string,
  ): Promise<any> {
    try {
      await this.dataStoreService.put({
        ...data,
        userUuid,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { success: true };
  }

  @Post('get')
  async get(
    @Body() data: KeyData,
    @Headers('useruuid') userUuid: string,
  ): Promise<any> {
    try {
      return await this.dataStoreService.get({
        ...data,
        userUuid,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('remove')
  async remove(
    @Body() data: KeyData,
    @Headers('useruuid') userUuid: string,
  ): Promise<any> {
    try {
      await this.dataStoreService.remove({
        ...data,
        userUuid,
      });
      return { success: true };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('commit')
  async commit(@Body() data: CommitDocument): Promise<DataResult> {
    try {
      return this.dataStoreService.commit(data);
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('upload/:storageId/:context/:fileExtension/:key')
  @UseInterceptors(FileInterceptor('file'))
  async putFile(
    @UploadedFile() file,
    @Headers('useruuid') userUuid: string,
    @Param('storageId') storageId: string,
    @Param('context') context: string,
    @Param('fileExtension') fileExtension: string,
    @Param('key') key: string,
  ): Promise<any> {
    try {
      const buffer: Buffer = file.buffer;
      const link = await this.dataStoreService.putFile({
        key: key,
        file: buffer,
        context: context,
        id: storageId,
        userUuid: userUuid,
        fileExtension: fileExtension,
      });
      return { link };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('attach/:storageId/:fileExtension')
  @UseInterceptors(FileInterceptor('file'))
  async attachFile(
    @UploadedFile() file,
    @Headers('useruuid') userUuid: string,
    @Headers('metadata') metadataJson: string,
    @Param('storageId') storageId: string,
    @Param('fileExtension') fileExtension: string,
  ): Promise<{ file: string }> {
    try {
      const buffer: Buffer = file.buffer;
      const link = await this.dataStoreService.attachFile({
        metadata: JSON.parse(metadataJson || '{}'),
        file: buffer,
        userUuid: userUuid,
        fileExtension: fileExtension,
        id: storageId,
      });
      return { file: link };
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('rule')
  async setRules(@Body() setDataRules: StorageDataRules): Promise<void> {
    try {
      await this.dataStoreService.setDataRules(
        setDataRules.rules,
        setDataRules.storageId,
      );
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('replace-macros')
  async replaceMacros(@Body() data: ReplaceMacrosDto): Promise<any> {
    try {
      return await this.dataStoreService.replaceMacros(data);
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
