import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from '@best-price-app/modules/test/controllers';
import { TestRepository } from '@best-price-app/modules/test/repositories';
import { TestService } from '@best-price-app/modules/test/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestRepository,
    ]),
  ],
  controllers: [TestController],
  exports: [TestService],
  providers: [TestService],
})
export class TestModule {}