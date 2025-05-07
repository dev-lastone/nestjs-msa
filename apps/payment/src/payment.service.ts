import { Inject, Injectable } from '@nestjs/common';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
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

      this.sendNotification(payload.orderId, payload.userEmail);

      return this.paymentRepo.findOneBy({
        id: paymentId,
      });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.REJECTED);
      }

      throw e;
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

  async sendNotification(orderId: string, to: string) {
    await lastValueFrom(
      this.notificationService.send(
        { cmd: 'send_payment_notification' },
        {
          orderId,
          to,
        },
      ),
    );
  }
}
