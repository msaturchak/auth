import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LocalModule } from './core/local/local.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory:(cfg: ConfigService): TypeOrmModule => ({
              ...cfg.getOrmConfig,
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
