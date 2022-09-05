import { User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    cuid: string;
    scope: string;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {}
}
