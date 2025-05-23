export class Product {
  productId: string;
  name: string;
  price: number;

  constructor(params: { productId: string; name: string; price: number }) {
    this.productId = params.productId;
    this.name = params.name;
    this.price = params.price;
  }
}
