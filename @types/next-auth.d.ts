import { User } from 'next-auth';

declare module 'next-auth' {
  interface User {
    cuid: string;
    email: string;
    image: string;
    name: string;
  }
  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {}
}
