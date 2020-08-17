import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '@best-price-app/common/dtos';
import { TestEntity } from '@best-price-app/modules/test/entities/test.entity';

export class TestDto extends AbstractDto {

    @ApiProperty()
    readonly title: string;
  
    @ApiProperty()
    readonly price: number;

    constructor(test: TestEntity) {
        super(test);
        this.title = test.title;
        this.price = test.price;
    }
}