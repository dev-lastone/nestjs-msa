import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/framework/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderDocument,
  OrderSchema,
} from './infrastructure/mongoose/entity/order.entity';
import { CreateOrderUseCase } from './use-case/create-order.use-case';
import { StartDeliveryUseCase } from './use-case/start-delivery.use-case';
import { OrderRepo } from './infrastructure/mongoose/repository/order.repo';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';
import { UserGrpc } from './infrastructure/grpc/user.grpc';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { CancelOrderUseCase } from './use-case/cancel-order.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrderDocument.name,
        schema: OrderSchema,
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    StartDeliveryUseCase,
    CancelOrderUseCase,
    {
      provide: 'OrderOutputPort',
      useClass: OrderRepo,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PaymentGrpc,
    },
    {
      provide: 'UserOutputPort',
      useClass: UserGrpc,
    },
    {
      provide: 'ProductOutputPort',
      useClass: ProductGrpc,
    },
  ],
})
export class OrderModule {}
