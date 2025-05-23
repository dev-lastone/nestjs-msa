import { Customer } from '../../domain/customer.entity';

export interface UserOutputPort {
  getUserById(userId: string): Promise<Customer>;
}
