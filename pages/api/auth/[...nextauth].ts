import { EGoogleScope } from '@customTypes/oauth';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@utils/authentication';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const getGoogleAuthUrl = (additionalScopes: EGoogleScope[] = []) =>
  `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    prompt: 'consent',
    access_type: 'offline',
    response_type: 'code',
    scope: [EGoogleScope.userinfo_profile, EGoogleScope.userinfo_email]
      .concat(additionalScopes)
      .join(' '),
  })}`;

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

type UpsertUserType = {
  gapiAccess: boolean;
  email: string;
  googleId: string;
  refreshToken: string;
  cliannaFolderId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqEmail = req.query.email as string;
  const reqGapiAccess = Boolean(req.query.gapiAccess);
  delete req.query.email;
  delete req.query.gapiAccess;
  console.log(reqEmail, reqGapiAccess);

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: getGoogleAuthUrl(
          reqGapiAccess ? [EGoogleScope.docs, EGoogleScope.drive] : []
        ),
        profile: async (profile, tokens) => {
          console.log(profile, tokens);
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
          //Create clianna folder for initial gapi access
          let cliannaFolderId: string | undefined;
          if (reqGapiAccess) {
            const gapi = new GapiWrapper(tokens.refresh_token);
            const cliannaFolder = await gapi.drive.files.create({
              requestBody: {
                name: `Clianna`,
                mimeType: 'application/vnd.google-apps.folder',
              },
            });
            console.log(cliannaFolder);
            if (!cliannaFolder.data.id) throw 'Invalid create response';
            cliannaFolderId = cliannaFolder.data.id;
          }

          const upsertValues: UpsertUserType = {
            gapiAccess,
            email: reqEmail ?? googleProfile.email,
            googleId: googleProfile.sub,
            refreshToken: tokens.refresh_token,
          };
          if (cliannaFolderId) upsertValues.cliannaFolderId = cliannaFolderId;
          const user = await prisma.user.upsert({
            where: reqEmail
              ? { email: reqEmail }
              : {
                  googleId: googleProfile.sub,
                },
            update: upsertValues,
            create: upsertValues,
          });

          return {
            id: user.googleId!,
            cuid: user.cuid,
            email: user.email,
            gapiAccess: user.gapiAccess,
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
              gapiAccess: user.gapiAccess,
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
            email: token.email,
            cuid: token.cuid,
            gapiAccess: token.gapiAccess,
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
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET,
  });
};

export default handler;
