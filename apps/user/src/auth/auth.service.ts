import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(rawToken: string, registerDto: RegisterDto) {
    const { email, password } = this.parseBasicToken(rawToken);

    return this.userService.create({
      ...registerDto,
      email,
      password,
    });
  }

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [email, password] = tokenSplit;

    return {
      email,
      password,
    };
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못됐습니다!');
    }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new BadRequestException('이메일 또는 비밀번호가 잘못됐습니다!');
    }

    return user;
  }

  async issueToken(user: any, isRefresh: boolean) {
    const refreshTokenSecret =
      this.configService.getOrThrow('JWT_REFRESH_SECRET');
    const accessTokenSecret =
      this.configService.getOrThrow('JWT_ACCESS_SECRET');

    return this.jwtService.signAsync(
      {
        sub: user.id ?? user.sub,
        role: user.role,
        type: isRefresh ? 'refresh' : 'access',
      },
      {
        secret: isRefresh ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefresh
          ? this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN')
          : this.configService.getOrThrow('JWT_ACCESS_EXPIRES_IN'),
      },
    );
  }

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          isRefreshToken ? 'JWT_REFRESH_SECRET' : 'JWT_ACCESS_SECRET',
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== 'refresh') {
          throw new BadRequestException('Refresh 토큰을 입력해주세요!');
        }
      } else {
        if (payload.type !== 'access') {
          throw new BadRequestException('Access 토큰을 입력해주세요!');
        }
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료됐습니다!');
    }
  }
}
