import { Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema()
export class PaymentDocument extends Document<ObjectId> {
  @Prop({
    required: true,
  })
  orderId: string;

  @Prop({
    type: String,
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    required: true,
  })
  cardNumberLastFourDigits: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
  })
  userEmail: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
