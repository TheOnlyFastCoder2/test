import { Database } from "bun:sqlite";
import {getMigrations, migrate} from 'bun-sqlite-migrations';
import Users from "./DataSources/users";
import Products from "./DataSources/products";

const db = new Database("rest-api.db");
migrate(db, getMigrations("./migration"));

export default {
  users: new Users(db),
  products: new Products(db),
};
