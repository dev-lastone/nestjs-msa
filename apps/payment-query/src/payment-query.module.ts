import { Module } from '@nestjs/common';
import { PaymentQueryController } from './payment-query.controller';
import { PaymentQueryService } from './payment-query.service';
import { PaymentDocument, PaymentSchema } from './document/payment.document';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentDocument.name,
        schema: PaymentSchema,
      },
    ]),
  ],
  controllers: [PaymentQueryController],
  providers: [PaymentQueryService],
})
export class PaymentQueryModule {}
