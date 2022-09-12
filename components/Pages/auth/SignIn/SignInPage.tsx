import { LockOutlined } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { FC, useCallback, useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const SignInPage: FC = () => {
  const router = useRouter();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (router.query.error) setError('Login fehlgeschlagen');
  }, [router.query.error]);

  const onClickGoogleButton = useCallback(
    () =>
      signIn('google', {
        callbackUrl: router.query.callbackUrl?.toString() ?? '/',
      }),
    [router.query.callbackUrl]
  );

  const onLogin = useCallback(
    async (email: string, password: string, newAccount: boolean) => {
      if (newAccount)
        await ApiClient.Instance.User.CreateCredentials({ email, password });

      signIn('credentials', {
        email,
        password,
        callbackUrl: router.query.callbackUrl?.toString() ?? '/',
      });
    },
    [router.query.callbackUrl]
  );

  return (
    <AuthLayout title="Anmeldung" icon={<LockOutlined />}>
      <CredentialsForm showError={setError} onLogin={onLogin} />
      <Box sx={{ my: 2, '.GoogleButton': { width: '100% !important' } }}>
        <GoogleButton
          className="GoogleButton"
          label="Mit Google anmelden"
          onClick={onClickGoogleButton}
        />
      </Box>
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
    </AuthLayout>
  );
};

export default SignInPage;
