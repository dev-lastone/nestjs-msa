import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.HTTP_PORT ?? 3000);
}
bootstrap();
