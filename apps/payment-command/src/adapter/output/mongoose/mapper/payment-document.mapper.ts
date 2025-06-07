import { PaymentDocument } from '../document/payment.document';
import { Payment } from '../../../../domain/payment.domain';

export class PaymentDocumentMapper {
  constructor(private readonly document: PaymentDocument) {}

  toDomain() {
    const model = new Payment({
      orderId: this.document.orderId,
      paymentMethod: this.document.paymentMethod,
      cardNumber: this.document.cardNumber,
      expiryYear: this.document.expiryYear,
      expiryMonth: this.document.expiryMonth,
      birthOrRegistration: this.document.birthOrRegistration,
      passwordTwoDigits: this.document.passwordTwoDigits,
      amount: this.document.amount,
      userEmail: this.document.userEmail,
    });

    model.assignId(this.document._id.toString());

    return model;
  }

  toPaymentQueryMsaPayload() {
    return {
      _id: this.document._id,
      orderId: this.document.orderId,
      userEmail: this.document.userEmail,
      amount: this.document.amount,
      paymentStatus: this.document.paymentStatus,
      cardNumberLastFourDigits: this.document.cardNumber.slice(-4),
    };
  }
}
