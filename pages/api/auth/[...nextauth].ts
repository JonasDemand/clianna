import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@utils/authentication';
import { google } from 'googleapis';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_AUTHORIZATION_URL = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
  {
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  }
)}`;

const prisma = new PrismaClient();

const oauth2 = google.oauth2('v2');

type GoogleProfile = {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: boolean;
  at_hash?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  iat?: number;
  exp?: number;
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: GOOGLE_AUTHORIZATION_URL,
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
        const user = await prisma.user.upsert({
          where: {
            googleId: googleProfile.sub,
          },
          update: {
            email: googleProfile.email,
            googleToken: tokens.refresh_token,
            googleScope: tokenInfo.data.scope,
          },
          create: {
            email: googleProfile.email,
            googleId: googleProfile.sub,
            googleToken: tokens.refresh_token,
            googleScope: tokenInfo.data.scope,
          },
        });
        return {
          id: googleProfile.sub,
          cuid: user.cuid,
          scope: tokenInfo.data.scope,
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
            email: user.email,
            cuid: user.cuid,
            scope: user.googleScope,
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
          cuid: token.cuid,
          scope: token.scope,
        },
      };
    },
    jwt: ({ token, user }): JWT => {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
  },
  pages: { signIn: '/auth/signin' },
  secret: process.env.NEXTAUTH_SECRET,
});
