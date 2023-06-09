import * as jsonminify from 'jsonminify';
import { PipelineEntity } from '../../persistence';
import { ApiProperty } from '@nestjs/swagger';

export class PutPipelineDto {
  @ApiProperty() userUuid: string;
  @ApiProperty() pipeline: string;

  public static toEntity(dto: PutPipelineDto): PipelineEntity {
    try {
      JSON.parse(jsonminify(dto.pipeline));
    } catch (e) {
      throw new Error(`Pipeline is not like JSON format`);
    }
    return <PipelineEntity>{
      user: { id: dto.userUuid },
      pipeline: dto.pipeline,
    };
  }
}
