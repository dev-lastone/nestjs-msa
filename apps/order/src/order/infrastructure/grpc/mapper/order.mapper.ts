import { Order } from '../../../domain/order.entity';
import { PaymentDto } from '../../../use-case/dto/create-order.dto';

export class OrderMapper {
  constructor(private readonly order: Order) {}

  toMakePaymentReq(payment: PaymentDto) {
    return {
      orderId: this.order.id,
      paymentMethod: payment.paymentMethod,
      paymentName: payment.paymentName,
      cardNumber: payment.cardNumber,
      expiryYear: payment.expiryYear,
      expiryMonth: payment.expiryMonth,
      birthOrRegistration: payment.birthOrRegistration,
      passwordTwoDigits: payment.passwordTwoDigits,
      amount: this.order.totalAmount,
      userEmail: this.order.customer.email,
    };
  }
}
