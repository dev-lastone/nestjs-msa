import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common/interceptor';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello();
  }

  makePayment(req: PaymentMicroservice.MakePaymentRequest, metadata: Metadata) {
    return this.paymentService.makePayment(
      {
        ...req,
        paymentMethod: req.paymentMethod as PaymentMethod,
      },
      metadata,
    );
  }
}
