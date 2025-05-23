export class Customer {
  userId: string;
  email: string;
  name: string;

  constructor(params: { userId: string; email: string; name: string }) {
    this.userId = params.userId;
    this.email = params.email;
    this.name = params.name;
  }
}
