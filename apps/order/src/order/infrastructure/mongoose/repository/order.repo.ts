import { OrderOutputPort } from '../../../port/output/order.output-port';
import { Model } from 'mongoose';
import { OrderDocument } from '../entity/order.entity';
import { Order } from '../../../domain/order.entity';
import { OrderDocumentMapper } from '../mapper/order-document.mapper';
import { InjectModel } from '@nestjs/mongoose';

export class OrderRepo implements OrderOutputPort {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderRepo: Model<OrderDocument>,
  ) {}

  async getOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findById(orderId);

    return new OrderDocumentMapper(order).toDomain();
  }

  async createOrder(order: Order): Promise<Order> {
    const createdOrder = await this.orderRepo.create(order);

    return new OrderDocumentMapper(createdOrder).toDomain();
  }

  async updateOrder(order: Order): Promise<Order> {
    const updatedOrder = await this.orderRepo.findByIdAndUpdate(
      order.id,
      order,
    );

    return new OrderDocumentMapper(updatedOrder).toDomain();
  }
}
