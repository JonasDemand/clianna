import { EGoogleScope } from '@customTypes/oauth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@utils/authentication';
import { getScope } from '@utils/oauth';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const gapiAccess = Boolean(req.query.gapiAccess);
  delete req.query.gapiAccess;

  return NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            scope: getScope(
              gapiAccess ? [EGoogleScope.docs, EGoogleScope.drive] : []
            ),
          },
        },
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'E-mail', type: 'email' },
          password: { label: 'Passwort', type: 'password' },
        },
        authorize: async (credentials) => {
          console.log(credentials);
          if (!credentials?.email || !credentials.password) return null;

          const user = await prisma.user.findUniqueOrThrow({
            where: { email: credentials.email },
          });
          if (!user.password || !user.salt) throw 'Invalid db user';

          const hash = await hashPassword(credentials?.password, user.salt);
          if (hash === user.password) return { id: user.id };
          return null;
        },
      }),
    ],
    callbacks: {
      session: async ({ session, user }) => {
        const prismaUser = await prisma.user.findUniqueOrThrow({
          where: { id: user.id },
          select: { accounts: { select: { refresh_token: true } } },
        });
        return {
          ...session,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            cliannaFolderId: user.cliannaFolderId,
            refreshToken: prismaUser.accounts[0]?.refresh_token ?? undefined,
          },
        };
      },
    },
    pages: { signIn: '/auth/signin' },
    secret: process.env.NEXTAUTH_SECRET,
  });
};

export default handler;
