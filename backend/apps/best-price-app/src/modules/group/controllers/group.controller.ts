import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { RelevantItemGroupsAlgorithm } from '@lib/item-package-combination';
import { GroupService } from '@best-price-app/modules/group/services';
import { TestService } from '@best-price-app/modules/test/services';
import { MATCH_RESULTS_COUNT } from '@best-price-app/common/constants';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly _groupService: GroupService,
    private readonly _testService: TestService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getTests(
    @Query('search') search,
    @Query('offset') offset,
    @Query('limit') limit,
  ) {
    try {
      return this._groupService.getGroups(search, offset, limit);
    } catch {
      throw new BadRequestException();
    }
  }

  @Post('best-price')
  @HttpCode(HttpStatus.OK)
  public async getBestPriceData(
    @Body('testIds') testIds,
  ) {
    try {
      const tests = await this._testService.getTestsByIds(testIds);
      const selectedTests = {
        ids: testIds,
        data: tests,
      };
      const matchedGroups = await this._groupService.getMatchedGroups(testIds);

      let relevantItemsObj = new RelevantItemGroupsAlgorithm(selectedTests, MATCH_RESULTS_COUNT);
      const results = relevantItemsObj.solve(matchedGroups, selectedTests);

      return this._groupService.fillResults(results);
    } catch {
      throw new BadRequestException();
    }
  }
}