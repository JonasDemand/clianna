import { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
  interface User {
    admin: boolean;
    email: string;
    id: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends User {}
}
