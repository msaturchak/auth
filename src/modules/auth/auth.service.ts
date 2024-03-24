import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/SignupDto.dto';
import { LoginDto } from './dto/LoginDto.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { TokenPayload } from 'src/core/interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signup(body: SignupDto) {
    const existsUser = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (existsUser) {
      throw new UnauthorizedException(
        'User with this email address already exists',
      );
    }

    const salt = await bcrypt.genSalt(4);

    const user = await this.userRepository.save({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: await bcrypt.hash(body.password, salt),
    });

    return {
      email: user.email,
    };
  }

  async login(body: LoginDto): Promise<{
    accessToken: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.generateAccessToken(user.id, user.email),
    };
  }

  async info(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Not found user');
    }

    return user;
  }

  private async generateAccessToken(
    sub: string,
    email: string,
  ): Promise<string> {
    const payload: TokenPayload = {
      sub,
      email,
    };

    const expiresIn = +this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    return this.jwtService.signAsync(payload, { expiresIn, secret });
  }
}
