import { PaymentEntity } from '../entity/payment.entity';
import { Payment } from '../../../../domain/payment.domain';

export class PaymentEntityMapper {
  constructor(private readonly paymentEntity: PaymentEntity) {}

  toDomain() {
    const payment = new Payment({
      paymentMethod: this.paymentEntity.paymentMethod,
      cardNumber: this.paymentEntity.cardNumber,
      expiryYear: this.paymentEntity.expiryYear,
      expiryMonth: this.paymentEntity.expiryMonth,
      birthOrRegistration: this.paymentEntity.birthOrRegistration,
      passwordTwoDigits: this.paymentEntity.passwordTwoDigits,
      amount: this.paymentEntity.amount,
      userEmail: this.paymentEntity.userEmail,
      orderId: this.paymentEntity.orderId,
    });

    payment.assignId(this.paymentEntity.id);

    return payment;
  }
}
