/* eslint-disable unused-imports/no-unused-imports */
import NextAuth from 'next-auth';
import NextAuthJwt from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    credentials: boolean;
    google: boolean;
    gapiAccess: boolean;
    cliannaFolderId: string | null;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    credentials: boolean;
    google: boolean;
    gapiAccess: boolean;
    cliannaFolderId: string | null;
  }
}
