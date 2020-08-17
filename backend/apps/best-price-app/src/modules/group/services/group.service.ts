import { Injectable, Logger } from '@nestjs/common';
import { Raw } from 'typeorm';

import { RelevantItem } from '@lib/item-package-combination';
import { GroupEntity } from '@best-price-app/modules/group/entities/group.entity';
import { GroupRepository } from '@best-price-app/modules/group/repositories';
import { TestService } from '@best-price-app/modules/test/services';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_MAX_EXTRA_TESTS_PERCENT,
  DEFAULT_MIN_MATCHED_TESTS_PERCENT,
  SMALL_TEST_AMOUNT_THRESHOLD,
  DEFAULT_MAX_EXTRA_TESTS_PERCENT_FOR_SMALL_TEST_AMOUNT,
} from '@best-price-app/common/constants';
import { Group } from '@best-price-app/interfaces';

@Injectable()
export class GroupService {
  private readonly _logger = new Logger(GroupService.name);

  constructor(
    private readonly _groupRepository: GroupRepository,
    private readonly _testService: TestService,
  ) {}

  getGroups(
    search: string = '',
    offset: number = DEFAULT_OFFSET,
    limit: number = DEFAULT_LIMIT,
  ): Promise<GroupEntity[]> {
    return this._groupRepository.find({
      where: { title: Raw(alias => `${alias} ILIKE '%${search}%' COLLATE "en_US"`) },
      relations: ['tests'],
      skip: offset,
      take: limit,
    });
  }

  async getMatchedGroups(
    testIds: number[],
    initialMaxExtraTestsPercent: number = DEFAULT_MAX_EXTRA_TESTS_PERCENT,
    minMatchedTestsPercent: number = DEFAULT_MIN_MATCHED_TESTS_PERCENT,
  ) {
    const maxExtraTestsPercent = testIds.length > SMALL_TEST_AMOUNT_THRESHOLD
      ? initialMaxExtraTestsPercent
      : DEFAULT_MAX_EXTRA_TESTS_PERCENT_FOR_SMALL_TEST_AMOUNT;

    const matchedGroups = await this._groupRepository.query(
      `SELECT * from get_most_suitable_groups(ARRAY [${testIds.join(',')}], ${maxExtraTestsPercent}, ${minMatchedTestsPercent})`
    );

    return this.convertNumericColumns(matchedGroups);
  }

  async fillResults(results: RelevantItem[]): Promise<RelevantItem[]> {
    return Promise.all(
      results.map(async (relevantItem) => {
        const { groups, bonus, ...rest } = relevantItem;
        const bonusTests = await this._testService.getTestsByIds(bonus as number[]);
        const filledGroups = await this.fillGroups(groups);
        const filledRelevantItem = new RelevantItem();
        filledRelevantItem.save({ ...rest, groups: filledGroups, bonus: bonusTests });
 
        return filledRelevantItem;
      })
    );
  }

  private async fillGroups(groups: Group[]): Promise<Group[]> {
    return Promise.all(
      groups.map(async ({ testIds, ...rest }) => {
        const groupTests = await this._testService.getTestsByIds(testIds as number[]);

        return {
          ...rest,
          tests: groupTests,
        }
      })
    );
  }

  private convertNumericColumns(matchedGroups) {
    return matchedGroups.map(({
      groupsId,
      price,
      totalTestsInGroupCount,
      matchedTestsCount,
      leftTestsCount,
      countOfOtherTests,
      testIds,
      ...rest
    }) => ({
      ...rest,
      groupsId: Number(groupsId),
      price: Number(price),
      totalTestsInGroupCount: Number(totalTestsInGroupCount),
      matchedTestsCount: Number(matchedTestsCount),
      leftTestsCount: Number(leftTestsCount),
      countOfOtherTests: Number(countOfOtherTests),
      testIds: testIds.map(Number)
    }));
  }
}