import { Module } from '@nestjs/common';
import { PaymentQueryController } from './payment-query.controller';
import { PaymentQueryService } from './payment-query.service';

@Module({
  imports: [],
  controllers: [PaymentQueryController],
  providers: [PaymentQueryService],
})
export class PaymentQueryModule {}
