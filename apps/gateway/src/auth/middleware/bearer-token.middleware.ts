import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { constructMetadata, USER_SERVICE, UserMicroservice } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
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
    return await lastValueFrom(
      this.authService.parseBearerToken(
        {
          token,
        },
        constructMetadata(BearerTokenMiddleware.name, 'verifyToken'),
      ),
    );
  }
}
