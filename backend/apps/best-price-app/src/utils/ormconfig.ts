import '@best-price-app/providers/polyfill.provider';

import { ConnectionOptions } from 'typeorm';
import { EnvService } from '@best-price-app/core/database/env.service';

const envConfig = new EnvService().read();

const baseConfig: ConnectionOptions = {
    type: envConfig.DB_TYPE,
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    username: envConfig.DB_USER,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
    entities: ['apps/best-price-app/src/modules/**/*{.entity,.index}{.ts,.js}'],
    migrationsRun: true,
    synchronize: false,
    logging: true,
    logger: 'file'
};

export = {
  migrations: ['apps/best-price-app/src/migrations/*{.ts,.js}'],
  seeds: ['apps/best-price-app/src/seeds/*{.ts,.js}'],
  ...baseConfig,
};
