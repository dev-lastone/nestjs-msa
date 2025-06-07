import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import {
  constructMetadata,
  ORDER_SERVICE,
  OrderMicroservice,
} from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );

    await this.kafkaService.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendPaymentNotification(
    dto: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(dto);

    try {
      await this.sendEmail();

      await this.updateNotificationStatus(
        notification._id.toString(),
        NotificationStatus.SENT,
      );

      this.sendDeliveryStartedMessage(dto.orderId, metadata);

      return this.notificationModel.findById(notification._id);
    } catch (e) {
      this.kafkaService.emit('order.notification.fail', dto.orderId);

      return this.notificationModel.findById(notification._id);
    }
  }

  sendDeliveryStartedMessage(id: string, metadata: Metadata) {
    this.orderService.deliveryStarted(
      {
        id,
      },
      constructMetadata(
        NotificationService.name,
        'sendDeliveryStartedMessage',
        metadata,
      ),
    );
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(dto: SendPaymentNotificationDto) {
    return await this.notificationModel.create({
      from: 'test@test.com',
      to: dto.to,
      subject: '배송 시작',
      content: `${dto.to}님, ${dto.orderId}의 배송이 시작되었습니다.`,
    });
  }
}
