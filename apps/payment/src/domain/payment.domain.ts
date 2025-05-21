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

export class PaymentDomain {
  id: string;
  orderId: string;
  status: PaymentStatus;
  method: PaymentMethod;
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
    method: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    this.status = PaymentStatus.PENDING;
    this.notificationStatus = NotificationStatus.PENDING;

    this.orderId = params.orderId;
    this.method = params.method;
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

    this.status = PaymentStatus.APPROVED;
  }

  rejectPayment() {
    this.#validateId();

    this.status = PaymentStatus.REJECTED;
  }

  sendNotification() {
    this.#validateId();

    this.notificationStatus = NotificationStatus.SENT;
  }
}
