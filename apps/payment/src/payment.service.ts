import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { ClientGrpc } from '@nestjs/microservices';
import {
  constructMetadata,
  NOTIFICATION_SERVICE,
  NotificationMicroservice,
} from '@app/common';
import { lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
        'NotificationService',
      );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async makePayment(payload: MakePaymentDto, metadata: Metadata) {
    let paymentId;
    try {
      const result = await this.paymentRepo.save(payload);
      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatus.APPROVED);

      this.sendNotification(payload.orderId, payload.userEmail, metadata);

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

  async sendNotification(orderId: string, to: string, metadata: Metadata) {
    await lastValueFrom(
      this.notificationService.sendPaymentNotification(
        {
          orderId,
          to,
        },
        constructMetadata(PaymentService.name, 'sendNotification', metadata),
      ),
    );
  }
}
