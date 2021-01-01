import { ApiProperty } from '@nestjs/swagger';

export class CommitDocument {
    @ApiProperty() storeId: string;
    @ApiProperty() bucket: string;
    @ApiProperty() fileName: string;
}
