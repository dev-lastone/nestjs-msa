import { NestFactory } from '@nestjs/core';
import { PaymentQueryModule } from './payment-query.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentQueryModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
