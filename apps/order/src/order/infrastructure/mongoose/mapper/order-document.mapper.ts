import { OrderDocument } from '../entity/order.entity';
import { Order } from '../../../domain/order.entity';

export class OrderDocumentMapper {
  constructor(private readonly document: OrderDocument) {}

  toDomain() {
    const order = new Order({
      customer: this.document.customer,
      products: this.document.products,
      deliveryAddress: this.document.deliveryAddress,
    });

    order.setId(this.document._id.toString());
    order.setPayment(this.document.payment);

    return order;
  }
}
