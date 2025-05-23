import { Payment } from './payment.entity';
import { DeliveryAddress } from './delivery-address.entity';
import { Product } from './product.entity';
import { Customer } from './customer.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_CANCELLED = 'paymentCancelled',
  PAYMENT_FAILED = 'paymentFailed',
  PAYMENT_PROCESSED = 'paymentProcessed',
  DELIVERY_STARTED = 'deliveryStarted',
  DELIVERY_DONE = 'deliveryDone',
}

export class Order {
  id: string;
  customer: Customer;
  products: Product[];
  deliveryAddress: DeliveryAddress;
  status: OrderStatus;
  payment: Payment;
  totalAmount: number;

  constructor(params: {
    customer: Customer;
    products: Product[];
    deliveryAddress: DeliveryAddress;
  }) {
    this.customer = params.customer;
    this.products = params.products;
    this.deliveryAddress = params.deliveryAddress;
  }

  setId(id: string) {
    this.id = id;
  }

  setPayment(payment: Payment) {
    if (!this.id) {
      throw new Error('Order ID is not assigned');
    }
    this.payment = payment;
  }

  calculateTotalAmount() {
    if (this.products.length === 0) {
      throw new Error('No products in the order');
    }

    const totalAmount = this.products.reduce(
      (total, product) => total + product.price,
      0,
    );

    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than zero');
    }

    this.totalAmount = totalAmount;
  }

  processPayment() {
    if (!this.id) {
      throw new Error('Order ID is not assigned');
    }

    if (!this.products || this.products.length === 0) {
      throw new Error('No products in the order');
    }

    if (!this.deliveryAddress) {
      throw new Error('Delivery address is not set');
    }

    if (!this.totalAmount) {
      throw new Error('Total amount is not calculated');
    }

    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order is not in pending status');
    }

    if (!this.payment) {
      throw new Error('Payment is not set');
    }

    this.status = OrderStatus.PAYMENT_PROCESSED;
  }

  cancel() {
    if (!this.id) {
      throw new Error('Order ID is not assigned');
    }

    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order is not in pending status');
    }

    this.status = OrderStatus.PAYMENT_CANCELLED;
  }

  startDelivery() {
    if (!this.id) {
      throw new Error('Order ID is not assigned');
    }

    if (this.status !== OrderStatus.PAYMENT_PROCESSED) {
      throw new Error('Order is not in payment processed status');
    }

    this.status = OrderStatus.DELIVERY_STARTED;
  }

  finishDelivery() {
    if (!this.id) {
      throw new Error('Order ID is not assigned');
    }

    if (this.status !== OrderStatus.DELIVERY_STARTED) {
      throw new Error('Order is not in delivery started status');
    }

    this.status = OrderStatus.DELIVERY_DONE;
  }
}
