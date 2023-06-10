import {
  Controller,
  HttpException,
  HttpStatus,
  Put,
  Request,
  Headers,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import * as rawbody from 'raw-body';
import { PutPipelineDto } from './dto/put-pipeline.dto';
import { PipelinePersistenceService } from '../../persistence/pipeline/pipeline-persistence.service';
import { TaskService } from '../../task';
import { PipelineEntity, TaskEntity } from '../../persistence';

@Controller('v1/pipeline')
export class PipelineController {
  constructor(
    private readonly pipelineService: PipelinePersistenceService,
    private readonly taskService: TaskService,
  ) {}

  @Post()
  async add(
    @Request() req: any,
    @Headers('useruuid') userUuid: string,
  ): Promise<PipelineEntity> {
    return this.upsert(req, undefined, userUuid);
  }

  @Put(':id')
  async upsert(
    @Request() req: any,
    @Param('id') id: string,
    @Headers('useruuid') userUuid: string,
  ): Promise<PipelineEntity> {
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

  @Post('start/:pipelineId')
  async startById(
    @Param('pipelineId') pipelineId: string,
  ): Promise<TaskEntity> {
    const pipeline = await this.pipelineService.findOne(pipelineId);
    if (!pipeline) {
      throw new NotFoundException(`Pipeline with id:${pipelineId} not present`);
    }
    const task = <TaskEntity>{
      parent: { id: pipelineId },
      user: { id: pipeline?.user?.id },
      status: 'pending',
      pipeline: pipeline.pipeline,
    };
    return this.taskService.create(task);
  }

  @Post('start')
  async pending(
    @Request() req: any,
    @Headers('useruuid') userUuid: string,
  ): Promise<TaskEntity> {
    const pipeline = await this.upsert(req, undefined, userUuid);
    const task = <TaskEntity>{
      parent: { id: pipeline.id },
      user: { id: pipeline?.user?.id },
      status: 'pending',
      pipeline: pipeline.pipeline,
    };
    return this.taskService.create(task);
  }
}
