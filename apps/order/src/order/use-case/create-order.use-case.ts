import { UserOutputPort } from '../port/output/user.output-port';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductOutputPort } from '../port/output/product.output-port';
import { Order } from '../domain/order.entity';
import { OrderOutputPort } from '../port/output/order.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('UserOutputPort')
    private readonly userOutputPort: UserOutputPort,
    @Inject('ProductOutputPort')
    private readonly productOutputPort: ProductOutputPort,
    @Inject('OrderOutputPort')
    private readonly orderOutputPort: OrderOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
  ) {}

  async execute(dto: CreateOrderDto) {
    const user = await this.userOutputPort.getUserById(dto.userId);
    const products = await this.productOutputPort.getProductsByIds(
      dto.productIds,
    );

    const order = new Order({
      customer: user,
      products: products,
      deliveryAddress: dto.address,
    });

    order.calculateTotalAmount();

    const createOrder = await this.orderOutputPort.createOrder(order);
    order.setId(createOrder.id);

    try {
      const paidOrder = await this.paymentOutputPort.processPayment(
        order,
        dto.payment,
      );

      order.setPayment(paidOrder.payment);
      await this.orderOutputPort.updateOrder(order);
    } catch (e) {
      order.cancel();
      await this.orderOutputPort.updateOrder(order);
    }

    return order;
  }
}
