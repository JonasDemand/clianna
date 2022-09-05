import { PrismaClient } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_AUTHORIZATION_URL = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
  {
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
  }
)}`;

const prisma = new PrismaClient();

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
        console.log(profile);
        if (!tokens.refresh_token || !tokens.id_token)
          throw 'Invalid token response';
        const googleProfile = profile as GoogleProfile;
        console.log(googleProfile);
        const name =
          googleProfile.given_name ??
          googleProfile.name ??
          googleProfile.family_name;
        if (!googleProfile.sub || !googleProfile.email || !name)
          throw 'Invalid google profile';
        const user = await prisma.user.upsert({
          where: {
            googleId: googleProfile.sub,
          },
          update: {
            name,
            email: googleProfile.email,
            googleToken: tokens.refresh_token,
          },
          create: {
            name,
            email: googleProfile.email,
            googleId: googleProfile.sub,
            googleToken: tokens.refresh_token,
          },
        });
        return {
          id: googleProfile.sub,
          cuid: user.cuid,
          name,
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
          cuid: token.cuid,
          name: token.name!,
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
  secret: process.env.SECRET,
});
