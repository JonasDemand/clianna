import { PrismaClient } from '@prisma/client';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqRefreshJwt = Boolean(req.query.refreshSession);
  delete req.query.refreshSession;

  return NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'E-mail', type: 'email' },
          password: { label: 'Passwort', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) return null;

          const user = await DbRepo.User.GetSingleFromEmail(credentials.email);
          if (!user) {
            DbRepo.User.Create(credentials);
            return null;
          }
          if (!user.enabled) return null;

          const isValid = await DbRepo.User.ValidateCredentials(
            credentials.email,
            credentials.password
          );
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
          };
        },
      }),
    ],
    callbacks: {
      session: ({ session, user, token }): Session => {
        return {
          ...session,
          user: {
            ...user,
            id: token.id,
            email: token.email,
            google: token.google,
            credentials: token.credentials,
            refreshToken: token.refreshToken,
            cliannaFolderId: token.cliannaFolderId,
          },
        };
      },
      jwt: async ({ token, user }): Promise<JWT> => {
        if (reqRefreshJwt) {
          const prismaUser = await prisma.user.findUniqueOrThrow({
            where: { id: token.id },
          });
          user = {
            id: prismaUser.id,
            email: prismaUser.email,
            credentials: !!prismaUser.password,
          };
        }
        if (user) {
          return {
            ...token,
            id: user.id,
            email: user.email,
            google: user.google,
            credentials: user.credentials,
            refreshToken: user.refreshToken,
            cliannaFolderId: user.cliannaFolderId,
          };
        }
        return token;
      },
    },
    pages: { signIn: '/auth/signin' },
    secret: environment.SECRET,
  });
};

export default handler;
