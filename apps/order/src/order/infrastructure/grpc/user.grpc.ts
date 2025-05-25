import { USER_SERVICE, UserMicroservice } from '@app/common';
import { UserOutputPort } from '../../port/output/user.output-port';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Customer } from '../../domain/customer.entity';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResMapper } from '../framework/mapper/get-user-info-res.mapper';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userClient: UserMicroservice.UserServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userClient =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
  }

  async getUserById(userId: string): Promise<Customer> {
    const res = await lastValueFrom(this.userClient.getUserInfo({ userId }));

    return new GetUserInfoResMapper(res).toDomain();
  }
}
