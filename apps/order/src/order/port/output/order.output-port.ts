import { Order } from '../../domain/order.entity';

export interface OrderOutputPort {
  getOrder(orderId: string): Promise<Order>;
  createOrder(order: Order): Promise<Order>;
  updateOrder(order: Order): Promise<Order>;
}
