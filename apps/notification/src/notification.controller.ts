import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { NotificationMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor } from '@app/common/interceptor';

@Controller()
@NotificationMicroservice.NotificationServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  async sendPaymentNotification(
    req: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    return this.notificationService.sendPaymentNotification(req, metadata);
  }
}
