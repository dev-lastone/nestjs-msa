import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.entity';
import {
  DeliveryAddress,
  DeliveryAddressSchema,
} from './delivery-address.entity';
import { Product, ProductSchema } from './product.entity';
import { Customer, CustomerSchema } from './customer.entity';
import { Document, ObjectId } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_CANCELLED = 'paymentCancelled',
  PAYMENT_FAILED = 'paymentFailed',
  PAYMENT_PROCESSED = 'paymentProcessed',
  DELIVERY_STARTED = 'deliveryStarted',
  DELIVERY_DONE = 'deliveryDone',
}

@Schema()
export class Order extends Document<ObjectId> {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: Customer;

  @Prop({
    type: [ProductSchema],
    required: true,
  })
  products: Product[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddress;

  @Prop({
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Prop({
    type: PaymentSchema,
    required: true,
  })
  payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
