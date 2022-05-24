import { PrismaClient } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { hashPassword } from '../../../utils/authentication';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (user === null) return null;
        const hash = await hashPassword(credentials?.password, user.salt);
        if (hash === user.password)
          return {
            admin: user.admin,
            email: user.email,
          };
        return null;
      },
    }),
  ],
  callbacks: {
    session: ({ session, user, token }): Session => {
      return {
        ...session,
        user: { ...user, admin: token.admin, email: token.email },
      };
    },
    jwt: ({ token, user }): JWT => {
      if (user) {
        return { ...token, admin: user.admin, email: user.email };
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.SECRET,
});
