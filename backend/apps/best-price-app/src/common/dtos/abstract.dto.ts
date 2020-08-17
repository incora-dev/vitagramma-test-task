import { AbstractEntity } from '@best-price-app/common/entities';

export class AbstractDto {
  readonly uuid: string;

  constructor(abstract: AbstractEntity) {
    this.uuid = abstract.uuid;
  }
}