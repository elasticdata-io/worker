import { ApiProperty } from '@nestjs/swagger';

export class KeyValueData {
	@ApiProperty() key: string;
	@ApiProperty() value: string;
	@ApiProperty() context: string;
	@ApiProperty() id: string;
	@ApiProperty() userUuid: string;
}
