import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentDocument, PaymentSchema } from './payment.entity';
import {
  DeliveryAddressDocument,
  DeliveryAddressSchema,
} from './delivery-address.entity';
import { ProductDocument, ProductSchema } from './product.entity';
import { CustomerDocument, CustomerSchema } from './customer.entity';
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
export class OrderDocument extends Document<ObjectId> {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: CustomerDocument;

  @Prop({
    type: [ProductSchema],
    required: true,
  })
  products: ProductDocument[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddressDocument;

  @Prop({
    type: String,
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Prop({
    type: PaymentSchema,
  })
  payment: PaymentDocument;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
