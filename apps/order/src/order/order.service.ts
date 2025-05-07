import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentCancelledException } from '../exception/payment-cancelled.exception';

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

    console.log(user);
  }

  async getUserFromToken(token: string) {
    const jwtRes = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (jwtRes.status === 'error') {
      throw new PaymentCancelledException(jwtRes);
    }

    const userId = jwtRes.data.sub;
    const userRes = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (userRes.status === 'error') {
      throw new PaymentCancelledException(userRes);
    }

    return userRes.data;
  }
}
