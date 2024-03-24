import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap((response) => {
        if (response instanceof UserEntity) {
          Object.assign(response, { password: undefined });
        }
        return response;
      }),
    );
  }
}
