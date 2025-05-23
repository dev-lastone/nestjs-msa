export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
}

export class Payment {
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentName: string;
  amount: number;

  constructor(params: {
    paymentMethod: PaymentMethod;
    paymentName: string;
    amount: number;
  }) {
    this.paymentMethod = params.paymentMethod;
    this.paymentName = params.paymentName;
    this.amount = params.amount;
  }
}
