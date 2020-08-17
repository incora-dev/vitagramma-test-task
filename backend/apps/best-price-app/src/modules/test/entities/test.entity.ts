import {
  Column,
  PrimaryColumn,
  Entity,
  AfterLoad,
} from 'typeorm';

import { AbstractEntity } from '@best-price-app/common/entities'; // To-Do: Check it
import { TestDto } from '@best-price-app/modules/test/dtos';
import { ColumnNumericTransformer } from '@best-price-app/common/transtormers';

@Entity({ name: 'tests' })
export class TestEntity extends AbstractEntity<TestDto> {

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

  dtoClass = TestDto;

  @AfterLoad()
  makeIdNumeric() {
    this.id = Number(this.id);
  }
}