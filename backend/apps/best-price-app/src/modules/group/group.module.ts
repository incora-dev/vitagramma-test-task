import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from '@best-price-app/modules/group/controllers';
import { GroupRepository } from '@best-price-app/modules/group/repositories';
import { GroupService } from '@best-price-app/modules/group/services';
import { TestRepository } from '@best-price-app/modules/test/repositories';
import { TestModule } from '../test/test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupRepository,
      TestRepository
    ]),
    TestModule,
  ],
  controllers: [GroupController],
  exports: [GroupService],
  providers: [GroupService],
})
export class GroupModule {}