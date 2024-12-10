import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'

import cors from "@elysiajs/cors";
import usersController from "./moules/users/users.controller";
import productsController from "./moules/products/products.controller";

const domains = [
  "http://127.0.0.1:3000/",
  "http://localhost:3000/"
]

export const App = new Elysia()
.use(cors())
.use(staticPlugin({
  alwaysStatic: true,
  noExtension: true
}))
.use(usersController)
.use(productsController)
.listen(4200);

// http://localhost:3000/
// http://127.0.0.1:3000/