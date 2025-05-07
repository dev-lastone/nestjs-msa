import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getProductsInfo(productIds: string[]) {
    return await this.productRepo.find({
      where: {
        id: In(productIds),
      },
    });
  }
}
