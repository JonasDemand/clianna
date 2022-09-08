import { EGoogleScope } from '@customTypes/oauth';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@utils/authentication';
import { getScope } from '@utils/oauth';
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

const prisma = new PrismaClient();

const oauth2 = google.oauth2('v2');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqGapiAccess = Boolean(req.query.gapiAccess);
  delete req.query.gapiAccess;

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            scope: getScope(
              reqGapiAccess ? [EGoogleScope.docs, EGoogleScope.drive] : []
            ),
          },
        },
        profile: async (profile, tokens) => {
          if (!tokens.refresh_token || !tokens.id_token)
            throw 'Invalid token response';

          const googleProfile = profile as GoogleProfile;
          if (!googleProfile.sub || !googleProfile.email)
            throw 'Invalid google profile';

          const tokenInfo = await oauth2.tokeninfo({
            access_token: tokens.access_token,
          });
          if (!tokenInfo.data.scope) throw 'Invalid scope';
          const gapiAccess = [EGoogleScope.docs, EGoogleScope.drive].every(
            (scope) => tokenInfo.data.scope?.includes(scope)
          );

          const user = await prisma.user.upsert({
            where: {
              googleId: googleProfile.sub,
            },
            update: {
              gapiAccess,
              googleId: googleProfile.sub,
              refreshToken: tokens.refresh_token,
            },
            create: {
              gapiAccess,
              email: googleProfile.email,
              googleId: googleProfile.sub,
              refreshToken: tokens.refresh_token,
            },
          });

          return {
            id: user.id,
            email: user.email,
            google: !!user.googleId,
            credentials: !!user.password,
            refreshToken: user.refreshToken,
            gapiAccess: user.gapiAccess,
            cliannaFolderId: user.cliannaFolderId,
          };
        },
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'E-mail', type: 'email' },
          password: { label: 'Passwort', type: 'password' },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) return null;

          const user = await prisma.user.findUniqueOrThrow({
            where: { email: credentials.email },
          });
          if (!user.password || !user.salt) throw 'Invalid db user';

          const hash = await hashPassword(credentials?.password, user.salt);
          if (hash === user.password)
            return {
              id: user.id,
              email: user.email,
              google: !!user.googleId,
              credentials: !!user.password,
              refreshToken: user.refreshToken,
              gapiAccess: user.gapiAccess,
              cliannaFolderId: user.cliannaFolderId,
            };
          return null;
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
            gapiAccess: token.gapiAccess,
            cliannaFolderId: token.cliannaFolderId,
          },
        };
      },
      jwt: ({ token, user }): JWT => {
        if (user) {
          return {
            ...token,
            id: user.id,
            email: user.email,
            google: user.google,
            credentials: user.credentials,
            refreshToken: token.refreshToken,
            gapiAccess: user.gapiAccess,
            cliannaFolderId: user.cliannaFolderId,
          };
        }
        return token;
      },
    },
    pages: { signIn: '/auth/signin' },
    secret: process.env.NEXTAUTH_SECRET,
  });
};

export default handler;
