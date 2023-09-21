import SignInPage from '@components/Pages/Auth/SignIn/SignInPage';
import ApiProvider from '@context/ApiContext';
import { NextPage } from 'next';
import React from 'react';

const SignIn: NextPage = () => (
  <ApiProvider>
    <SignInPage />
  </ApiProvider>
);

export default SignIn;
