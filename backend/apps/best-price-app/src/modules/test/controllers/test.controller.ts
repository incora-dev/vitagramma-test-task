import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { TestService } from '@best-price-app/modules/test/services';

@Controller('tests')
export class TestController {
  constructor(private readonly _testService: TestService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getTests(
    @Query('search') search,
    @Query('offset') offset,
    @Query('limit') limit,
  ) {
    try {
      return this._testService.getTests(search, offset, limit);
    } catch {
      throw new BadRequestException();
    }
  }
}