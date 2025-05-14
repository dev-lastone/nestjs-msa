import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './entity/order.entity';
import { OrderMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  // @Post()
  // @UsePipes(ValidationPipe)
  // async createOrder(
  //   @Authorization() token: string,
  //   @Body() createOrderDto: CreateOrderDto,
  // ) {
  //   return this.orderService.createOrder(createOrderDto, token);
  // }
  async deliveryStarted(req: OrderMicroservice.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(
      req.id,
      OrderStatus.DELIVERY_STARTED,
    );
  }

  async createOrder(req: OrderMicroservice.CreateOrderRequest) {
    return this.orderService.createOrder({
      ...req,
      payment: {
        ...req.payment,
        paymentMethod: req.payment.paymentMethod as PaymentMethod,
      },
    });
  }
}
