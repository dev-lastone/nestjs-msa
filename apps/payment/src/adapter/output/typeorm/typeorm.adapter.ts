import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Payment } from '../../../domain/payment.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { PaymentEntityMapper } from './mapper/payment-entity.mapper';

export class TypeormAdapter implements DatabaseOutputPort {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async savePayment(payment: Payment): Promise<Payment> {
    return this.paymentRepository.save(payment);
  }

  async updatePayment(payment: Payment): Promise<Payment> {
    await this.paymentRepository.update(payment.id, payment);

    const result = await this.paymentRepository.findOne({
      where: { id: payment.id },
    });

    return new PaymentEntityMapper(result).toDomain();
  }
}
