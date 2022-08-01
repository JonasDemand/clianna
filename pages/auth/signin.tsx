import { GetServerSideProps, NextPage } from 'next';
import { getCsrfToken } from 'next-auth/react';

import { LoginForm } from './../../components/Authentication/LoginForm';

type SignInProps = { csrfToken: string | undefined; error: boolean };

const SignIn: NextPage<SignInProps> = ({ csrfToken, error }) => {
  return <LoginForm csrfToken={csrfToken} error={error} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: (await getCsrfToken(context)) ?? '',
      error: context.query.error !== undefined,
    } as SignInProps,
  };
};

export default SignIn;
