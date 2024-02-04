import { getApiClient } from '@utils/api/ApiClient';
import { environment } from '@utils/config';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

const ApiClient = getApiClient({
  baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
});

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const { data, error } = await ApiClient.user.authenticateCreate({
            email: credentials.email as string,
            password: credentials.password as string,
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
    session: (args: any): Session => ({
      ...args,
      ...args.session,
      ...args.token,
    }),
    jwt: async (args): Promise<JWT> => {
      if (!args.token.accessToken)
        return { ...args, ...args.token, ...args.user };
      try {
        const jwt = jwtDecode(args.token.accessToken);
        if (jwt.exp && Date.now() >= jwt.exp * 1000) {
          console.trace('refreshing');
          const { error, data } = await ApiClient.user.refreshUpdate(
            {
              refreshToken: args.token.refreshToken,
            },
            {
              headers: {
                Authorization: `Bearer ${args.token.accessToken}`,
              },
            }
          );
          if (
            error ||
            !data ||
            !data.id ||
            !data.email ||
            !data.accessToken ||
            !data.refreshToken
          )
            throw new Error('Failed to get new access token');
          return {
            ...args,
            ...args.token,
            ...args.user,
            id: data.id,
            email: data.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        }
      } catch (e) {
        console.error(e);
        return { ...args, ...args.token, ...args.user };
      }
      return { ...args, ...args.token, ...args.user };
      /*TODO if (!reqRefreshSession) return { ...args, ...args.token, ...args.user };
      const { error, data } = await ApiClient.user.profileList({
        headers: {
          Authorization: `Bearer ${args.token.accessToken}`,
        },
      });
      if (error || !data || !data.id || !data.email)
        throw new Error('Failed to retrieve session');
      return {
        ...args,
        ...args.token,
        ...args.user,
        id: data.id,
        email: data.email,
      };*/
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
});
