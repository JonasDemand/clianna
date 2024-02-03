import { getApiClient } from '@utils/api/ApiClient';
import { environment } from '@utils/config';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const ApiClient = getApiClient({
  baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
});

var reqRefreshSession: boolean = false;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const { data, error } = await ApiClient.user.authenticateCreate({
            email: credentials.email,
            password: credentials.password,
          });
          if (
            error ||
            !data ||
            !data.id ||
            !data.email ||
            !data.accessToken ||
            !data.refreshToken
          )
            return null;

          return data as User;
        } catch (e) {
          console.error(e);
          return null;
        }
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
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      };
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      if (reqRefreshSession) {
        const { error, data } = await ApiClient.user.profileList({
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
        if (error || !data || !data.id || !data.email)
          throw new Error('Failed to retrieve session');
        return {
          ...token,
          ...user,
          id: data.id,
          email: data.email,
        };
      }
      return { ...token, ...user };
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 15 * 60 },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  reqRefreshSession = !!req.url?.endsWith('?refreshSession=true');
  delete req.query?.refreshSession;

  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
