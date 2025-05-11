import { CanActivate, ExecutionContext } from '@nestjs/common';

export class TokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return !!request.user;
  }
}
