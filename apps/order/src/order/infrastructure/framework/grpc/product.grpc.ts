import { PRODUCT_SERVICE, ProductMicroservice } from '@app/common';
import { ProductOutputPort } from '../../../port/output/product.output-port';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Product } from '../../../domain/product.entity';
import { lastValueFrom } from 'rxjs';
import { GetProductsInfoResMapper } from '../mapper/get-products-info-res.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productClient: ProductMicroservice.ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productClient =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
  }

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const res = await lastValueFrom(
      this.productClient.getProductsInfo({
        productIds,
      }),
    );

    return new GetProductsInfoResMapper(res).toDomain();
  }
}
