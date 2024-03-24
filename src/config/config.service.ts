/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { join, relative, resolve } from 'path';
import { DataSourceOptions } from 'typeorm';

import { EnvKeys } from './env-keys.enum';

@Injectable()
export class ConfigService {
  constructor(
    private readonly cfg: NestConfigService<Record<EnvKeys, unknown>, true>,
  ) {}
  
  get getOrmConfig(): DataSourceOptions {
    const dbDir = relative(process.cwd(), resolve(`${__dirname}/..`));

    return {
      type: 'postgres',
      host: this.cfg.get(EnvKeys.POSTGRES_HOST),
      port: this.cfg.get(EnvKeys.POSTGRES_PORT),
      username: this.cfg.get(EnvKeys.POSTGRES_USERNAME),
      password: this.cfg.get(EnvKeys.POSTGRES_PASSWORD),
      database: this.cfg.get(EnvKeys.POSTGRES_DATABASE),
      entities: [join(dbDir, '**', '*.entity.{ts,js}')],
      synchronize: true,
    };
  }
}
