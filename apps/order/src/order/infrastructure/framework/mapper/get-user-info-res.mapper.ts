import { UserMicroservice } from '@app/common';
import { Customer } from '../../../domain/customer.entity';

export class GetUserInfoResMapper {
  constructor(private readonly res: UserMicroservice.GetUserInfoResponse) {}

  toDomain() {
    return new Customer({
      userId: this.res.id,
      name: this.res.name,
      email: this.res.email,
    });
  }
}
