import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PaymentMicroservice } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PaymentMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/payment.proto'),
      url: configService.getOrThrow('GRPC_URL'),
    },
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payment-command',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'payment-command-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
