import { Injectable } from '@nestjs/common';
import { PaymentDocument } from './document/payment.document';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PaymentQueryService {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentRepo: Model<PaymentDocument>,
  ) {}

  saveDocument(document: PaymentDocument) {
    return this.paymentRepo.create(document);
  }

  updateDocument(document: PaymentDocument) {
    const { _id, ...rest } = document;

    return this.paymentRepo.findByIdAndUpdate(_id, rest);
  }
}
