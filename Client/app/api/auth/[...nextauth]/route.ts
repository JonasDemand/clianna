import { Client } from '@utils/api/generated/Api';
import { environment } from '@utils/config';
import NextAuth, { AuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const ApiClient = new Client({
  baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
});

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
            username: credentials.email,
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
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
