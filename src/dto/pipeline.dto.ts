import { ApiProperty } from '@nestjs/swagger';

class PipelineCommand {
  @ApiProperty({ type: String }) cmd: string;
}

class PipelineDataRule {
  @ApiProperty({ type: String }) cmd: string;
}

export class PipelineDto {
  @ApiProperty({ type: String }) version: '2.0';
  @ApiProperty({ type: [PipelineCommand] }) commands: Array<object>;
  @ApiProperty({ type: [PipelineDataRule], required: false })
  dataRules: Array<object>;

  public static validate(dto: PipelineDto): void {
    if (!dto?.version) {
      throw new Error('version is required field');
    }
    if (dto.version !== '2.0') {
      throw new Error(`version "${dto.version}" is not supported`);
    }
    if (!dto?.commands) {
      throw new Error('commands is required field');
    }
    if (!dto?.commands.length) {
      throw new Error('commands cannot be empty');
    }
  }
}
