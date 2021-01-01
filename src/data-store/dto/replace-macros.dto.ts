import { ApiProperty } from '@nestjs/swagger';

export class ReplaceMacrosDto {
	@ApiProperty() inputWithMacros: string;
	@ApiProperty() context: string;
	@ApiProperty() id: string;
}
