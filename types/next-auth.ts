import { DefaultSession, User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      admin: boolean;
      email: string;
    } & DefaultSession['user'];
  }
  interface User extends NextAuthUser {
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
