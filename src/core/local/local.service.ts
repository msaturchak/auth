import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class LocalService {
  constructor(private readonly cls: ClsService) {}

  getUser() {
    const user = this.cls.get<TokenPayload>('user');
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
