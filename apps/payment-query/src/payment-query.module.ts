import { Module } from '@nestjs/common';
import { PaymentQueryController } from './payment-query.controller';
import { PaymentQueryService } from './payment-query.service';
import { PaymentDocument, PaymentSchema } from './document/payment.document';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_DB_URL'),
      }),
      inject: [ConfigService],
    }),
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
