import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMsa: ClientProxy,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const token = this.getRawToken(req);

    if (!token) {
      next();
      return;
    }

    const payload = await this.verifyToken(token);

    req.user = payload;

    next();
  }

  getRawToken(req: Request): string | null {
    return req.headers['authorization'];
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.userMsa.send(
        {
          cmd: 'parse_bearer_token',
        },
        {
          token,
        },
      ),
    );

    if (result.status === 'error') {
      throw new UnauthorizedException();
    }

    return result.data;
  }
}
