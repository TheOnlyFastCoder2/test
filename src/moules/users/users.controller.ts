import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

import { UserDTO  } from './user.dto';
import UsersService from "./users.service";

export default (
  new Elysia({prefix: '/users'})
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET
  }))
  .model({
    'auth.signIn': UserDTO.signIn,
    'auth.singUp': UserDTO.signUp, 
  })

  .get('/me', async ({jwt, error, headers, cookie: {auth}}) => {
    let authAccessToken = headers?.authorization?.replace("Bearer ", "");

    if (!authAccessToken) {
      authAccessToken = auth?.value;
      if(!authAccessToken){
        return error(401, "Access token is missing");
      }
    }
  
    try {
      const jwtPayload = await jwt.verify(authAccessToken);

      if (!jwtPayload) {
        return error(401, "Invalid access token");
      }
  
      const userOrError = await UsersService.authJWT(jwtPayload.sub!);
  
      if (!userOrError) {
        return error(401, "Invalid access token or user not found.");
      }
      
      return {
        token: authAccessToken,
        ...userOrError,
      };
    } catch (err: unknown) {
      console.error("JWT verification error:", err);
      if(err instanceof Error && err.message ==='invalid signature'){
          return error(401, "Invalid access token");
      }
      return error(500, "Internal server error");
    }
  })
  
  .post('/sign-in', async ({body, jwt, error, cookie: { auth }}) => {
    const result = await UsersService.signIn(body,
      async (idUser: number, created_at: number) => {
        await jwt.sign({
          sub: `${idUser}`,
          exp: created_at,
        })
        .then((data) => {
          auth.set({
            value: data,
            httpOnly: true,
            maxAge: 7 * 86400
          })
        })
      }
    );
    if(typeof result === "string") {
      return error(400 , result);
    }

    return {
      token: auth.value,
      ...result
    };
  }, {body: 'auth.signIn'})

  .post('/sign-up', async ({body, jwt, error, set, cookie: { auth }}) => {
    const errorOrUser = await UsersService.signUp(body,
      async (idUser: number, created_at: number) => {
        await jwt.sign({
          sub: `${idUser}`,
          exp: created_at,
        })
        .then((data) => {
          auth.set({
            value: data,
            httpOnly: true,
            maxAge: 7 * 86400
          })
        })
      }
    );
   
   if(typeof errorOrUser === "string") {
    return error(400 , errorOrUser);
   }

    set.status = 201;
    return 'The user is registered';

  }, {body: 'auth.singUp'})
)