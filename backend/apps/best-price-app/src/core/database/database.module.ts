import { Module, Global, DynamicModule } from '@nestjs/common';
import { EnvModule } from './env.module';
import { EnvService } from './env.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

function DatabaseOrmModule (): DynamicModule {
  const config = new EnvService().read();

  return TypeOrmModule.forRoot({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,

    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'], //To-Do: check it
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    seeds: [__dirname + '/../../seeds/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
    logger: 'file',
  } as TypeOrmModuleOptions);
}

@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule()
  ]
})
export class DatabaseModule { }