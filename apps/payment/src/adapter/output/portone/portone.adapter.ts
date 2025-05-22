import { PaymentOutputPort } from '../../../port/output/payment.output-port';
import { Payment } from '../../../domain/payment.domain';

export class PortOneAdapter implements PaymentOutputPort {
  async processPayment(payment: Payment): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
