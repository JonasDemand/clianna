import NextApiClient from '@utils/api/NextApiClient';
import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
      },
      async authorize(credentials) {
        if (typeof credentials === 'undefined') return null;
        console.log(credentials);
        const { data, error } = await NextApiClient.user.authenticateCreate({
          username: credentials.email,
          password: credentials.password,
        });
        console.log(data);
        if (error || !data || !data.email || !data.id || !data.token) {
          return null;
        }
        return {
          id: data.id,
          email: data.email,
          token: data.token,
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
  //pages: { signIn: '/login' },
  secret: process.env.SECRET,
  session: { strategy: 'jwt' },
  debug: true,
});

export { handler as GET, handler as POST };
