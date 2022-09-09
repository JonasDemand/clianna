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

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);
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
          params: reqGapiAccess
            ? {
                prompt: 'consent',
                access_type: 'offline',
                scope: getScope([EGoogleScope.docs, EGoogleScope.drive]),
              }
            : { scope: getScope() },
        },
        profile: async (profile, tokens) => {
          const googleProfile = profile as GoogleProfile;

          let refreshToken: string | undefined | null = tokens.refresh_token;
          if (!refreshToken) {
            const existingUser = await prisma.user.findUnique({
              where: { googleId: profile.sub },
              select: { refreshToken: true },
            });
            refreshToken = existingUser?.refreshToken ?? undefined;
          }
          if (refreshToken) {
            oauth2Client.setCredentials({
              refresh_token: refreshToken,
            });
            try {
              //If the user revokes access the refeshToken needs to be deleted to prevent errors
              await oauth2.tokeninfo({
                auth: oauth2Client,
              });
            } catch {
              refreshToken = null;
            }
          }

          const user = await prisma.user.upsert({
            where: {
              googleId: googleProfile.sub,
            },
            update: {
              refreshToken,
              googleId: googleProfile.sub,
            },
            create: {
              refreshToken,
              email: googleProfile.email,
              googleId: googleProfile.sub,
            },
          });

          return {
            id: user.id,
            email: user.email,
            google: !!user.googleId,
            credentials: !!user.password,
            refreshToken: user.refreshToken,
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
            refreshToken: user.refreshToken,
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
