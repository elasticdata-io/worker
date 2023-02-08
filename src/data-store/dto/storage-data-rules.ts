import { ApiProperty } from '@nestjs/swagger';

class Rule {
  @ApiProperty() cmd: string;
  @ApiProperty() bindKey: string;
}

export default class StorageDataRules {
  @ApiProperty() storageId: string;
  @ApiProperty() rules: Array<Rule>;
}
