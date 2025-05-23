import { PaymentMethod } from '../../domain/payment.entity';

export class CreateOrderDto {
  userId: string;
  productIds: string[];
  address: AddressDto;
  payment: PaymentDto;
}

export class AddressDto {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export class PaymentDto {
  paymentMethod: PaymentMethod;
  paymentName: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  amount: number;
}
