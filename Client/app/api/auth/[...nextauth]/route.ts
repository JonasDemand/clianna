import { getApiClient } from '@utils/api/ApiClient';
import { environment } from '@utils/config';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { AuthOptions, Session } from 'next-auth';
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
          if (error || !data || !data.email || !data.id || !data.token) {
            return null;
          }
          return {
            id: data.id,
            email: data.email,
            token: data.token,
          };
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
          token: token.token,
        },
      };
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      if (reqRefreshSession) {
        const { error, data } = await ApiClient.user.sessionList({
          headers: { Authorization: `Bearer ${token?.token ?? user?.token}` },
        });
        if (error || !data || !data.id || !data.email || !data.token)
          throw new Error('Failed to retrieve session');
        user = {
          id: data.id,
          email: data.email,
          token: data.token,
        };
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          token: user.token,
        };
      }
      return token;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 12 * 30 * 24 * 60 * 60 },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  reqRefreshSession = !!req.url?.endsWith('?refreshSession=true');
  delete req.query?.refreshSession;

  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
