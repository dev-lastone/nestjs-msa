import { Prop, Schema } from '@nestjs/mongoose';

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
}

@Schema()
export class Notification extends Document {
  @Prop({
    required: true,
  })
  from: string;

  @Prop({
    required: true,
  })
  to: string;

  @Prop({
    required: true,
  })
  subject: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;
}
