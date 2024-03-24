import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Auth = (name: 'jwt') =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthGuard(name)));
