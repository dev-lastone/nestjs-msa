import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './entity/order.entity';
import { OrderMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common/interceptor';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  async deliveryStarted(req: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(
      req.id,
      OrderStatus.DELIVERY_STARTED,
    );
  }

  async createOrder(
    req: OrderMicroservice.CreateOrderRequest,
    metadata: Metadata,
  ) {
    return this.orderService.createOrder(
      {
        ...req,
        payment: {
          ...req.payment,
          paymentMethod: req.payment.paymentMethod as PaymentMethod,
        },
      },
      metadata,
    );
  }
}
