import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NotificationMicroservice } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: NotificationMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/notification.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
