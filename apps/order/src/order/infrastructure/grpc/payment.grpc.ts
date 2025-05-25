import { PaymentMicroservice } from '@app/common';
import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Order, OrderStatus } from '../../domain/order.entity';
import { PaymentDto } from '../../use-case/dto/create-order.dto';
import { lastValueFrom } from 'rxjs';
import { OrderMapper } from './mapper/order.mapper';
import { PaymentStatus } from '../../../../../payment/src/domain/payment.domain';
import { PaymentFailedException } from '../../../exception/payment-failed.exception';
import { MakePaymentResMapper } from '../framework/mapper/make-payment-res.mapper';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject()
    private readonly paymentMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  async processPayment(order: Order, paymentDto: PaymentDto): Promise<Order> {
    const res = await lastValueFrom(
      this.paymentService.makePayment(
        new OrderMapper(order).toMakePaymentReq(paymentDto),
      ),
    );

    const isPaid = res.paymentStatus === PaymentStatus.APPROVED;
    const orderStatus = isPaid
      ? OrderStatus.PAYMENT_PROCESSED
      : OrderStatus.PAYMENT_FAILED;

    if (orderStatus === OrderStatus.PAYMENT_FAILED) {
      throw new PaymentFailedException(res);
    }

    return new MakePaymentResMapper(res).toDomain(order, paymentDto);
  }
}
