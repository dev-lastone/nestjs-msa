import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserPayloadDto } from '@app/common';

export const UserPayload = createParamDecorator<UserPayloadDto>(
  (data: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException('Token Guard not applied');
    }

    return user;
  },
);
