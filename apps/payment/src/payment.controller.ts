import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.paymentService.getHello();
  }

  makePayment(req: PaymentMicroservice.MakePaymentRequest) {
    return this.paymentService.makePayment({
      ...req,
      paymentMethod: req.paymentMethod as PaymentMethod,
    });
  }
}
