import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
    @ApiProperty()
    readonly groups: Array<Array<number>>;
  
    @ApiProperty()
    readonly tests: Array<number>;

    @ApiProperty()
    readonly testIds: Array<number>;
}