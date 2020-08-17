import { Injectable, Logger } from '@nestjs/common';
import { In, Raw } from 'typeorm';

import { TestEntity } from '@best-price-app/modules/test/entities/test.entity';
import { TestRepository } from '@best-price-app/modules/test/repositories';
import { DEFAULT_OFFSET, DEFAULT_LIMIT } from '@best-price-app/common/constants';

@Injectable()
export class TestService {
  private readonly _logger = new Logger(TestService.name);

  constructor(
    private readonly _testRepository: TestRepository
  ) {}

  getTests(
    search: string = '',
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT,
  ): Promise<TestEntity[]> {
    return this._testRepository.find({
      where: { title: Raw(alias => `${alias} ILIKE '%${search}%' COLLATE "en_US"`) },
      skip: offset,
      take: limit,
    });
  }

  getTestsByIds(ids: number[] = []): Promise<TestEntity[]> {
    if (ids.length === 0) return Promise.resolve([]);

    return this._testRepository.find({ id: In(ids) });
  }
}