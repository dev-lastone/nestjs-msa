import { Payment } from '../../domain/payment.domain';

export interface PaymentOutputPort {
  processPayment(payment: Payment): Promise<boolean>;

  cancelPayment(orderId: string): Promise<boolean>;
}
