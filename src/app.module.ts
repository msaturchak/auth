import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { AuthModule } from './modules/auth/auth.module';
import { LocalModule } from './core/local/local.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'test'
          ? (cfg: ConfigService): TypeOrmModule => ({
              ...cfg.getOrmConfig,
              autoLoadEntities: true,
            })
          : (cfg: ConfigService): TypeOrmModule => ({
              ...cfg.getOrmConfigTesting,
              autoLoadEntities: true,
            }),
      inject: [ConfigService],
    }),
    AuthModule,
    LocalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
