import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMsa: ClientProxy,
  ) {}

  register(token: string, registerDto: RegisterDto) {
    return lastValueFrom(
      this.userMsa.send(
        {
          cmd: 'register',
        },
        {
          ...registerDto,
          token,
        },
      ),
    );
  }
}
