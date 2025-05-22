export enum PaymentStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
}

export class Payment {
  id: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  notificationStatus: NotificationStatus;
  amount: number;
  userEmail: string;

  constructor(params: {
    orderId: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    this.paymentStatus = PaymentStatus.PENDING;
    this.notificationStatus = NotificationStatus.PENDING;

    this.orderId = params.orderId;
    this.paymentMethod = params.paymentMethod;
    this.cardNumber = params.cardNumber;
    this.expiryYear = params.expiryYear;
    this.expiryMonth = params.expiryMonth;
    this.birthOrRegistration = params.birthOrRegistration;
    this.passwordTwoDigits = params.passwordTwoDigits;
    this.amount = params.amount;
    this.userEmail = params.userEmail;
  }

  assignId(id: string) {
    this.id = id;
  }

  #validateId() {
    if (!this.id) {
      throw new Error('Payment ID is not assigned');
    }
  }

  processPayment() {
    this.#validateId();

    this.paymentStatus = PaymentStatus.APPROVED;
  }

  rejectPayment() {
    this.#validateId();

    this.paymentStatus = PaymentStatus.REJECTED;
  }

  sendNotification() {
    this.#validateId();

    this.notificationStatus = NotificationStatus.SENT;
  }
}
