import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PaymentCancelledException } from '../exception/payment-cancelled.exception';
import { Product } from './entity/product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './entity/order.entity';
import { Model } from 'mongoose';
import { Customer } from './entity/customer.entity';
import { AddressDto } from './dto/address.dto';
import { PaymentDto } from './dto/payment.dto';
import {
  constructMetadata,
  PAYMENT_SERVICE,
  PaymentMicroservice,
  PRODUCT_SERVICE,
  ProductMicroservice,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import { PaymentFailedException } from '../exception/payment-failed.exception';
import { PaymentStatus } from '../../../payment/src/entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class OrderService implements OnModuleInit {
  userService: UserMicroservice.UserServiceClient;
  productService: ProductMicroservice.ProductServiceClient;
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
    this.productService =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(createOrderDto: CreateOrderDto, metadata: Metadata) {
    const { productIds, payment, address, meta } = createOrderDto;

    const user = await this.getUserFromToken(meta.user.sub, metadata);

    const products = await this.getProductsByIds(productIds, metadata);

    const totalAmount = this.#calculateTotalAmount(products);

    this.#validatePaymentAmount(totalAmount, payment.amount);

    const customer = this.#createCustomer(user);

    const order = await this.#createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    await this.processPayment(
      order._id.toString(),
      payment,
      user.email,
      metadata,
    );

    return this.orderModel.findById(order._id);
  }

  async getUserFromToken(userId: string, metadata: Metadata) {
    return await lastValueFrom(
      this.userService.getUserInfo(
        { userId },
        constructMetadata(OrderService.name, 'getUserFromToken', metadata),
      ),
    );
  }

  async getProductsByIds(
    productIds: string[],
    metadata: Metadata,
  ): Promise<Product[]> {
    const res = await lastValueFrom(
      this.productService.getProductsInfo(
        { productIds },
        constructMetadata(OrderService.name, 'getProductsByIds', metadata),
      ),
    );

    return res.products.map((product) => ({
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

  async #createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return await this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  async processPayment(
    orderId: string,
    payment: PaymentDto,
    userEmail: string,
    metadata: Metadata,
  ) {
    try {
      const res = await lastValueFrom(
        this.paymentService.makePayment(
          {
            ...payment,
            userEmail,
            orderId,
          },
          constructMetadata(OrderService.name, 'processPayment', metadata),
        ),
      );

      const isPaid = res.paymentStatus === PaymentStatus.APPROVED;
      const orderStatus = isPaid
        ? OrderStatus.PAYMENT_PROCESSED
        : OrderStatus.PAYMENT_FAILED;

      if (orderStatus === OrderStatus.PAYMENT_FAILED) {
        throw new PaymentFailedException(res);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.PAYMENT_PROCESSED,
      });
    } catch (e) {
      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.PAYMENT_FAILED,
        });
      }
      throw e;
    }
  }

  changeOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}
