import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { LocalService } from './local.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [LocalService],
  exports: [LocalService],
})
export class LocalModule {}
