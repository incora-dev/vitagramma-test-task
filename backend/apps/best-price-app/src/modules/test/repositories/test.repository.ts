import { TestEntity } from '@best-price-app/modules/test/entities/test.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(TestEntity)
export class TestRepository extends Repository<TestEntity> {}