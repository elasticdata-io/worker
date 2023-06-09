import {
  Controller,
  HttpException,
  HttpStatus,
  Put,
  Request,
  Headers,
  Post,
  Param,
} from '@nestjs/common';
import * as rawbody from 'raw-body';
import { PutPipelineDto } from './put-pipeline.dto';
import { PipelineService } from '../../persistence/pipeline/pipeline.service';

@Controller('v1/pipeline')
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Post()
  async add(
    @Request() req: any,
    @Headers('useruuid') userUuid: string,
  ): Promise<unknown> {
    return this.upsert(req, undefined, userUuid);
  }

  @Put(':id')
  async upsert(
    @Request() req: any,
    @Param('id') id: string,
    @Headers('useruuid') userUuid: string,
  ): Promise<unknown> {
    try {
      if (req.readable) {
        const raw = await rawbody(req);
        const pipeline = raw.toString().trim();
        const dto: PutPipelineDto = {
          id,
          pipeline,
          userUuid,
        };
        return this.pipelineService.put(PutPipelineDto.toEntity(dto));
      } else {
        throw new HttpException(
          `Header: 'Content-Type' must by 'text/plain'`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      throw new HttpException(
        {
          message: e.toString(),
          stack: e.stack,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
