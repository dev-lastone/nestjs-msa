import { Test, TestingModule } from '@nestjs/testing';
import { PaymentQueryController } from './payment-query.controller';
import { PaymentQueryService } from './payment-query.service';

describe('PaymentQueryController', () => {
  let paymentQueryController: PaymentQueryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentQueryController],
      providers: [PaymentQueryService],
    }).compile();

    paymentQueryController = app.get<PaymentQueryController>(PaymentQueryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(paymentQueryController.getHello()).toBe('Hello World!');
    });
  });
});
