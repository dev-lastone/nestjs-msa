import { Order } from '../../domain/order.entity';
import { PaymentDto } from '../../use-case/dto/create-order.dto';

export interface PaymentOutputPort {
  processPayment(order: Order, paymentDto: PaymentDto): Promise<Order>;
}
