import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentQueryService {
  getHello(): string {
    return 'Hello World!';
  }
}
