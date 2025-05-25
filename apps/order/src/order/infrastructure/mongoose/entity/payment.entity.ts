import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
}

@Schema({
  _id: false,
})
export class PaymentDocument {
  @Prop()
  paymentId: string;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    required: true,
  })
  paymentName: string;

  @Prop({
    required: true,
  })
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
