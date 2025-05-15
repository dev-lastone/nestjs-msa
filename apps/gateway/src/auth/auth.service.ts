import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { constructMetadata } from '@app/common/grpc/util/constructMetadata';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  register(token: string, registerDto: RegisterDto) {
    return lastValueFrom(
      this.authService.registerUser(
        {
          ...registerDto,
          token,
        },
        constructMetadata(AuthService.name, 'register'),
      ),
    );
  }

  login(token: string) {
    return lastValueFrom(
      this.authService.loginUser(
        {
          token,
        },
        constructMetadata(AuthService.name, 'login'),
      ),
    );
  }
}
