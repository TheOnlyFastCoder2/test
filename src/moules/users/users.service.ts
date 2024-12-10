import db from '@/db';
import { UserDTOSignUp, UserDTOSignIn, UserDTOReturned } from './user.dto';

type TCbToCreateJWTToken = (userId:number, created_at:number) => void;


export default abstract class Service {
  static async authJWT(id: string): Promise<UserDTOReturned|false> {
    const errorOrUser = await db.users.checkUserByID(id);
    
    if(errorOrUser) {
      delete errorOrUser.id;
      delete errorOrUser.password;
    }

    return errorOrUser;
  }
  
  static async signIn(body: UserDTOSignIn,  cbToCreateJWTToken: TCbToCreateJWTToken): Promise<UserDTOReturned|string> {
    const user = await db.users.checkUserByEmail(body.email);
    if(user !== false && user.password) {
      const password = await Bun.password.verifySync(body.password, user.password, 'bcrypt');
      await cbToCreateJWTToken(user.id!, 
        Math.floor(new Date(user.created_at).getTime() / 1000)
      );
      delete user.password;
      delete user.id;
      return password ? user : "Invalid password";
    }
    return "The user with this email does not exist";
  }

  static async signUp(body: UserDTOSignUp, cbToCreateJWTToken: TCbToCreateJWTToken) {
    const isFroundUser = await db.users.checkUserByEmail(body.email);
    if(isFroundUser === false) {
      body.password = await Bun.password.hash(body.password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const user = await db.users.createUser(body);
 
      await cbToCreateJWTToken(user.id!, 
        Math.floor(new Date(user.created_at).getTime() / 1000)
      );
      delete user.password;
      delete user.id;
      return user;
    }

    return "A user with this email already exists";
  }
}