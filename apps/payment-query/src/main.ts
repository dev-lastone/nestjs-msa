import { NestFactory } from '@nestjs/core';
import { PaymentQueryModule } from './payment-query.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PaymentQueryModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payment-query',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'payment-update-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices();

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
