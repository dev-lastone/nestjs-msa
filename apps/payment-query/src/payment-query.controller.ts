import { Controller, Get } from '@nestjs/common';
import { PaymentQueryService } from './payment-query.service';

@Controller()
export class PaymentQueryController {
  constructor(private readonly paymentQueryService: PaymentQueryService) {}

  @Get()
  getHello(): string {
    return this.paymentQueryService.getHello();
  }
}
