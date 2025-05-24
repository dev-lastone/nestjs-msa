import { PaymentMicroservice } from '@app/common';
import { PaymentDto } from '../../../dto/payment.dto';
import { Order } from '../../../domain/order.entity';
import { PaymentMethod } from '../../../domain/payment.entity';

export class MakePaymentResMapper {
  constructor(private readonly res: PaymentMicroservice.MakePaymentResponse) {}

  toDomain(order: Order, payment: PaymentDto) {
    order.setPayment({
      ...payment,
      ...this.res,
      paymentId: this.res.id,
      paymentMethod: this.res.paymentMethod as PaymentMethod,
    });

    return order;
  }
}
