import { ApiProperty } from '@nestjs/swagger';

export class KeyData {
  @ApiProperty() key: string;
  @ApiProperty() context: string;
  @ApiProperty() id: string;
  @ApiProperty() userUuid: string;
}
