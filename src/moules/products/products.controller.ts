import Elysia, { error } from "elysia";
import productsService from "./products.service";
import { ProductQueryParams } from './product.dto';

export default (
  new Elysia({prefix: '/products'})
  .get('/', ({query}) => {
    if(productsService.checkTypeProduct(query.type)) {
      return productsService.getProducts(query);
    } else {
      return error(422, "Make sure that the type parameter accepts (pizza|sushi)")
    }
  }, {
    query: ProductQueryParams
  })
)