import { OrderMicroservice } from '@app/common';
import { CreateOrderDto } from '../../../use-case/dto/create-order.dto';
import { PaymentMethod } from '../../../domain/payment.entity';

export class CreateOrderReqMapper {
  constructor(private readonly req: OrderMicroservice.CreateOrderRequest) {}

  toDomain(): CreateOrderDto {
    return {
      userId: this.req.meta.user.sub,
      productIds: this.req.productIds,
      address: this.req.address,
      payment: {
        ...this.req.payment,
        paymentMethod: this.req.payment.paymentMethod as PaymentMethod,
      },
    };
  }
}
