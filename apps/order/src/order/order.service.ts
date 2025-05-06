import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const user = await this.getUserFromToken(token);
  }

  async getUserFromToken(token: string) {
    const res = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    console.log(res);
  }
}
