import {
  Column,
  PrimaryColumn,
  Entity,
  ManyToMany,
  JoinTable,
  AfterLoad,
} from 'typeorm';

import { AbstractEntity } from '@best-price-app/common/entities';
import { TestEntity } from '@best-price-app/modules/test/entities/test.entity';
import { GroupDto } from '@best-price-app/modules/group/dtos';
import { ColumnNumericTransformer } from '@best-price-app/common/transtormers';

@Entity({ name: 'groups' })
export class GroupEntity extends AbstractEntity<GroupDto> {

    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column('decimal', {
      precision: 13,
      scale: 2,
      default: 0,
      nullable: false,
      transformer: new ColumnNumericTransformer(),
    })
    price: number;

    @ManyToMany(type => TestEntity)
    @JoinTable()
    tests: TestEntity[];

    dtoClass = GroupDto;

    @AfterLoad()
    makeIdNumeric() {
      this.id = Number(this.id);
    }
}