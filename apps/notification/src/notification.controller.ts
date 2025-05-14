import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { NotificationMicroservice } from '@app/common';

@Controller()
@NotificationMicroservice.NotificationServiceControllerMethods()
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  async sendPaymentNotification(req: SendPaymentNotificationDto) {
    return this.notificationService.sendPaymentNotification(req);
  }
}
