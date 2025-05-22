import { Controller, UseInterceptors } from '@nestjs/common';
import { PaymentMicroservice } from '@app/common';
import { GrpcInterceptor } from '@app/common/interceptor';
import { PaymentMethod } from '../../domain/payment.domain';
import { PaymentService } from '../../application/payment.service';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  makePayment(req: PaymentMicroservice.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...req,
      paymentMethod: req.paymentMethod as PaymentMethod,
    });
  }
}
