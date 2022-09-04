import { PrismaClient } from '@prisma/client';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

type GoogleProfile = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
};

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      profile: async (profile, tokens) => {
        if (!tokens.access_token || !tokens.id_token)
          throw 'Invalid token response';
        const googleProfile = profile as GoogleProfile;
        const user = await prisma.user.upsert({
          where: {
            email: profile.email,
          },
          update: {
            name: googleProfile.given_name,
            picture: googleProfile.picture,
            googleToken: tokens.access_token,
          },
          create: {
            email: googleProfile.email,
            name: googleProfile.given_name,
            picture: googleProfile.picture,
            googleToken: tokens.access_token,
          },
        });
        return {
          id: tokens.id_token,
          cuid: user.cuid,
          email: user.email,
          image: user.picture,
          name: user.name,
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
          email: token.email!,
          image: token.image,
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
