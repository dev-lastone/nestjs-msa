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
    @Inject('PRODUCT_SERVICE')
    private readonly productService: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const user = await this.getUserFromToken(token);

    const products = await this.getProductsByIds(createOrderDto.productIds);
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

  async getProductsByIds(productIds: string[]) {
    const res = await lastValueFrom(
      this.productService.send({ cmd: 'get_products_info' }, { productIds }),
    );

    if (res.status === 'error') {
      throw new PaymentCancelledException('상품 정보가 잘못되었습니다.');
    }

    return res.data.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }
}
