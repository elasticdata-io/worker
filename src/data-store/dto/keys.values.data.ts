import { ApiProperty } from '@nestjs/swagger';

export class KeysValuesData {
	@ApiProperty() userUuid: string;
	@ApiProperty({ type: [Object] }) values: Array<object>;
	@ApiProperty() context: string;
	@ApiProperty() id: string;
}
