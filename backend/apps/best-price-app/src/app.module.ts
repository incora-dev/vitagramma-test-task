import { Module } from '@nestjs/common';

// core
import { DatabaseModule } from '@best-price-app/core/database/database.module';

// modules
import { GroupModule } from '@best-price-app/modules/group/group.module';
import { TestModule } from '@best-price-app/modules/test/test.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    TestModule,
    GroupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
