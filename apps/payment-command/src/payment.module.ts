import { Module } from '@nestjs/common';
import { PaymentController } from './adapter/input/payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_SERVICE,
  NotificationMicroservice,
  traceInterceptor,
} from '@app/common';
import { join } from 'path';
import { PaymentEntity } from './adapter/output/typeorm/entity/payment.entity';
import { PaymentService } from './application/payment.service';
import { GrpcAdapter } from './adapter/output/grpc/grpc.adapter';
import { PortOneAdapter } from './adapter/output/portone/portone.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentDocument,
  PaymentSchema,
} from './adapter/output/mongoose/document/payment.document';
import { MongooseAdapter } from './adapter/output/mongoose/mongoose.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        DB_URL: Joi.string().required(),
        MONGO_DB_URL: Joi.string().required(),
        GRPC_URL: Joi.string().required(),
        NOTIFICATION_GRPC_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ...(configService.get('NODE_ENV') === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('payment')],
              },
              package: NotificationMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/notification.proto'),
              url: configService.getOrThrow('NOTIFICATION_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([PaymentEntity]),
    MongooseModule.forFeature([
      {
        name: PaymentDocument.name,
        schema: PaymentSchema,
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'DatabaseOutputPort',
      useClass: MongooseAdapter,
    },
    {
      provide: 'NetworkOutputPort',
      useClass: GrpcAdapter,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PortOneAdapter,
    },
  ],
})
export class PaymentModule {}
