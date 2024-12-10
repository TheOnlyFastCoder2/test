import Database from "bun:sqlite";
import { ProductQueryReturned } from '@/moules/products/product.dto';
import { ProductDTOReturned } from "@/moules/products/product.dto";

export default class {
  constructor(private readonly db: Database){}

  async getProducts(type: string, limit: number , offset: number) {
    const res = await this.db
    .query('SELECT * FROM products WHERE type=$type LIMIT $limit OFFSET $offset')
    .all(type,limit,offset);
    return res as ProductDTOReturned[];
  }
}