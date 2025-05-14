import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsInfoDto } from './dto/get-products-info.dto';
import { ProductMicroservice } from '@app/common';

@Controller('product')
export class ProductController
  implements ProductMicroservice.ProductServiceController
{
  constructor(private readonly productService: ProductService) {}

  @Get()
  getHello(): string {
    return this.productService.getHello();
  }

  async getProductsInfo(req: GetProductsInfoDto) {
    const res = await this.productService.getProductsInfo(req.productIds);

    return {
      products: res,
    };
  }

  async createSamples() {
    const res = await this.productService.createSamples();

    return {
      success: res,
    };
  }
}
