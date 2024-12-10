import {t} from 'elysia'; 

export const UserDTO = {
  sample: t.Object({
    id: t.Number(),
    first_name: t.String(),
    last_name: t.String(),
    password: t.String(),
    email: t.String(),
    created_at: t.String()
  }),

  signIn: t.Object({
    password: t.String(),
    email: t.String(),
  }),

  signUp: t.Object({
    first_name: t.String(),
    last_name: t.String(),
    email: t.String(),
    password: t.String(),
  }),
}

export type UserDTOSignIn = typeof UserDTO.signIn.static;
export type UserDTOSignUp = typeof UserDTO.signUp.static;
export type UserDTOSample = typeof UserDTO.sample.static;
export type UserDTOReturned = Partial<Pick<UserDTOSample, 'password'|'id'>> & Omit<UserDTOSample, 'password'|'id'>;
