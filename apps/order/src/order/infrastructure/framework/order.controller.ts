import { Controller, UseInterceptors } from '@nestjs/common';
import { OrderMicroservice } from '@app/common';
import { GrpcInterceptor } from '@app/common/interceptor';
import { CreateOrderUseCase } from '../../use-case/create-order.use-case';
import { StartDeliveryUseCase } from '../../use-case/start-delivery.use-case';
import { CreateOrderReqMapper } from './mapper/create-order-req.mapper';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
  ) {}

  async deliveryStarted(req: OrderMicroservice.DeliveryStartedRequest) {
    await this.startDeliveryUseCase.execute(req.id);
  }

  async createOrder(req: OrderMicroservice.CreateOrderRequest) {
    return this.createOrderUseCase.execute(
      new CreateOrderReqMapper(req).toDomain(),
    );
  }
}
