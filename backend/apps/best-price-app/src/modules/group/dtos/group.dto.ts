import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '@best-price-app/common/dtos';
import { GroupEntity } from '@best-price-app/modules/group/entities/group.entity';

export class GroupDto extends AbstractDto {

    @ApiProperty()
    readonly title: string;
  
    @ApiProperty()
    readonly price: number;

    constructor(group: GroupEntity) {
        super(group);
        this.title = group.title;
        this.price = group.price;
    }
}