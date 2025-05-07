import { Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async makePayment(payload: MakePaymentDto) {
    let paymentId;
    try {
      const result = await this.paymentRepo.save(payload);
      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatus.APPROVED);

      return this.paymentRepo.findOneBy({
        id: paymentId,
      });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.REJECTED);
      }
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepo.update(
      {
        id,
      },
      {
        paymentStatus: status,
      },
    );
  }
}
