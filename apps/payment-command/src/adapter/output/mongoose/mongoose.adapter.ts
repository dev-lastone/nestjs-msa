import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Payment } from '../../../domain/payment.domain';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDocument } from './document/payment.document';
import { Model } from 'mongoose';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class MongooseAdapter implements DatabaseOutputPort, OnModuleInit {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async onModuleInit() {
    await this.kafkaService.connect();
  }

  async savePayment(payment: Payment): Promise<Payment> {
    const model = await this.paymentModel.create(payment);

    this.kafkaService.emit(
      'payment.created',
      new PaymentDocumentMapper(model).toPaymentQueryMsaPayload(),
    );

    return new PaymentDocumentMapper(model).toDomain();
  }

  async updatePayment(payment: Payment): Promise<Payment> {
    const model = await this.paymentModel.create(payment);

    this.kafkaService.emit(
      'payment.update',
      new PaymentDocumentMapper(model).toPaymentQueryMsaPayload(),
    );

    return new PaymentDocumentMapper(model).toDomain();
  }
}
