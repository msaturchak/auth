import { Controller, Post, Body, Get, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/SignupDto.dto';
import { LoginDto } from './dto/LoginDto.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { User } from 'src/core/decorators/user.decorator';
import { TokenPayload } from 'src/core/interfaces/token-payload.interface';
import { AuthInterceptor } from './auth.interceptor';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto): Promise<{
    email: string;
  }> {
    return this.authService.signup(body);
  }

  @Post('signin')
  login(@Body() body: LoginDto): Promise<{
    accessToken: string;
  }> {
    return this.authService.login(body);
  }

  @Get('me')
  @Auth('jwt')
  me(@User() user: TokenPayload): Promise<UserEntity> {
    return this.authService.info(user.email);
  }
}
