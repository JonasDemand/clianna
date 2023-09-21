/* eslint-disable unused-imports/no-unused-imports */
import NextAuth from 'next-auth';
import NextAuthJwt from 'next-auth/jwt';

interface ISession {
  id: string;
  email: string;
  token: string;
}

declare module 'next-auth' {
  interface User extends ISession {}
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends ISession {}
}
