import db from '@/db';
import { ProductQueryReturned } from './product.dto';



export default abstract class Service {
  static async getProducts({type, page, limit}: ProductQueryReturned) {
    const offset = (page - 1) * limit;
    return db.products.getProducts(type, limit, offset);
  }

  static checkTypeProduct(typeProduct: string): boolean  {
    const regex = /^(pizza|soushi)$/;
    return regex.test(typeProduct);
  }
}