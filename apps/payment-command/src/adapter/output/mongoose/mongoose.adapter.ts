import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Payment } from '../../../domain/payment.domain';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDocument } from './document/payment.document';
import { Model } from 'mongoose';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class MongooseAdapter implements DatabaseOutputPort {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

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

  async findPaymentByOrderId(orderId: string): Promise<Payment> {
    const result = await this.paymentModel.findOne({
      orderId,
    });

    return new PaymentDocumentMapper(result).toDomain();
  }
}
