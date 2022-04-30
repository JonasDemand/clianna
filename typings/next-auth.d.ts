import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      admin: boolean;
    } & DefaultSession['user'];
  }
  interface User extends User {
    admin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    admin: boolean;
  }
}
