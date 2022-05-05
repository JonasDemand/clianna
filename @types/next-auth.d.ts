import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      admin: boolean;
      email: string;
    } & DefaultSession['user'];
  }
  interface User extends User {
    admin: boolean;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    admin: boolean;
    email: string;
  }
}
