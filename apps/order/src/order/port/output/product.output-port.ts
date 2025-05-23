import { Product } from '../../domain/product.entity';

export interface ProductOutputPort {
  getProductsByIds(productIds: string[]): Promise<Product[]>;
}
