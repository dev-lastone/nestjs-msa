import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { ORDER_SERVICE, OrderMicroservice } from '@app/common';

@Injectable()
export class NotificationService implements OnModuleInit {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendPaymentNotification(dto: SendPaymentNotificationDto) {
    const notification = await this.createNotification(dto);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatus.SENT,
    );

    this.sendDeliveryStartedMessage(dto.orderId);

    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(id: string) {
    this.orderService.deliveryStarted({
      id,
    });
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
