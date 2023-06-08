import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';

class PipelineUserInteractionSettings {
  @ApiProperty() watchCommands: Array<object>;
}

class PipelineWindowSettings {
  @ApiProperty() width: number;
  @ApiProperty() height: number;
  @ApiProperty() lang: string;
}

class NetworkSkipResourcesDslDto {
  @ApiProperty() stylesheet: boolean;
  @ApiProperty() image: boolean;
  @ApiProperty() font: boolean;
}

class PipelineNetwork {
  @ApiProperty() skipResources: NetworkSkipResourcesDslDto;
}

class PipelineSettings {
  @ApiProperty() maxWorkingMinutes: number;
  @ApiProperty() window: PipelineWindowSettings;
  @ApiProperty() proxies: string[];
  @ApiProperty() userInteraction: PipelineUserInteractionSettings;
  @ApiProperty() network: PipelineNetwork;
}

export class RunTaskDto {
  @ApiProperty({ type: [String, Object] }) json: string | object;
  @ApiProperty({ required: false }) taskId?: string;
  @ApiProperty({ required: false }) pipelineId?: string;
  @ApiProperty({ required: false }) pipelineSettings?: PipelineSettings;
  @ApiProperty({ required: false }) userUuid?: string;
  @ApiProperty({ required: false }) proxies?: string[];

  public static fillEmpty(dto: RunTaskDto): RunTaskDto {
    dto.taskId = dto.taskId ?? uuidv4();
    dto.pipelineId = dto.pipelineId ?? '0637bfd9-7cc0-40ce-815a-86c00c1ba4f1';
    dto.pipelineSettings = dto.pipelineSettings ?? ({} as PipelineSettings);
    dto.userUuid = dto.userUuid ?? '0637bfd9-7cc0-40ce-815a-86c00c1ba4f1';
    dto.proxies = dto.proxies ?? [];
    return dto;
  }

  public static validate(dto: RunTaskDto): void {
    if (!dto.json) {
      throw new Error('json is required field');
    }
  }
}
