// eslint-disable-next-line unused-imports/no-unused-imports
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    password?: string;
    salt?: string;
    cliannaFolderId?: string;
  }
  interface Session {
    user: Pick<User, 'id' | 'name' | 'email' | 'image' | 'cliannaFolderId'> & {
      refreshToken?: string;
    };
  }
}
