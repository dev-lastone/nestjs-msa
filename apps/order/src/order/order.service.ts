import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentCancelledException } from '../exception/payment-cancelled.exception';
import { Product } from './entity/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './entity/order.entity';
import { Model } from 'mongoose';
import { Customer } from './entity/customer.entity';
import { AddressDto } from './dto/address.dto';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
    @Inject('PRODUCT_SERVICE')
    private readonly productService: ClientProxy,
    @InjectModel('Order')
    private readonly orderModel: Model<Order>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, payment, address } = createOrderDto;

    const user = await this.getUserFromToken(token);

    const products = await this.getProductsByIds(productIds);

    const totalAmount = this.#calculateTotalAmount(products);

    this.#validatePaymentAmount(totalAmount, payment.amount);

    const customer = this.#createCustomer(user);

    const order = await this.#createNewOrder(
      customer,
      products,
      address,
      payment,
    );
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

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
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

  #calculateTotalAmount(products: Product[]) {
    return products.reduce((acc, product) => acc + product.price, 0);
  }

  #validatePaymentAmount(totalAmount: number, paymentAmount: number) {
    if (totalAmount !== paymentAmount) {
      throw new PaymentCancelledException('결제 금액이 일치하지 않습니다.');
    }
  }

  #createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  #createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }
}
