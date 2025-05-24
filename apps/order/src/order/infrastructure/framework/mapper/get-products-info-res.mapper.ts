import { ProductMicroservice } from '@app/common';
import { Product } from '../../../domain/product.entity';

export class GetProductsInfoResMapper {
  constructor(
    private readonly res: ProductMicroservice.GetProductsInfoResponse,
  ) {}

  toDomain() {
    return this.res.products.map(
      (product) =>
        new Product({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
    );
  }
}
