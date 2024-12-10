import { t } from 'elysia';

export const ProductDTO = t.Object({
  id: t.Number(),
  type: t.String(),
  price: t.Number(),
  title: t.String(),
  srcImg: t.String(),
  description: t.String(),
  created_at: t.String(),
});

export const ProductQueryParams = t.Object({
  limit: t.Number(),
  page: t.Number(),
  type: t.String(),
})

export type ProductDTOReturned = typeof ProductDTO.static;
export type ProductQueryReturned = typeof ProductQueryParams.static;