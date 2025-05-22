import { Payment } from '../../domain/payment.domain';

export interface DatabaseOutputPort {
  savePayment(payment: Payment): Promise<Payment>;

  updatePayment(payment: Payment): Promise<Payment>;
}
