import { UserDTOSignUp, UserDTOSignIn, UserDTOReturned } from "@/moules/users/user.dto";
import Database from "bun:sqlite";

export default class {
  constructor(private readonly db: Database) {}

  async createUser({
    first_name,
    last_name,
    email,
    password,
  }: UserDTOSignUp): Promise<UserDTOReturned> {
    try {
      const now = new Date();
      const created_at = now.toISOString();
  
      await this.db
        .prepare(
          `
          INSERT INTO users 
          (first_name, last_name, email, password, created_at) VALUES
          (?,?,?,?,?)
          `
        )
        .run(first_name, last_name, email, password, created_at);
      
      const user = await this.db
      .prepare(`SELECT * FROM users WHERE id = (SELECT last_insert_rowid());`)
      .get();
      
      return user as UserDTOReturned;
    } catch (error) {
      throw new Error(`Failed to create a user: ${error}`);
    }
  }
  
  
  async checkUserByEmail(email: UserDTOSignIn["email"]): Promise<false|UserDTOReturned> {
    try {
      const user = await this.db
      .query(`SELECT * FROM users WHERE email=$email`)
      .get(email) as null|UserDTOReturned;
      
      return user !== null ? user : false;
    } catch (error) {
      throw new Error(`Failed to verify the user: ${error}`);
    }
  }

  async checkUserByID(userID: string): Promise<false|UserDTOReturned> {
    try {
      const user = await this.db
      .query(`SELECT * FROM users WHERE id=$userID`)
      .get(userID) as UserDTOReturned|null;
      return user !== null ? user : false;
    } catch (error) {
      throw new Error(`Failed to verify the user: ${error}`);
    }
  }
}