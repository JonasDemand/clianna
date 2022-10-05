import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import { Google } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import React, { FC, useCallback, useState } from 'react';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const LinkPage: FC = () => {
  const router = useRouter();

  const [error, setError] = useState<string>();

  const onLogin = useCallback(
    async (email: string, password: string) => {
      const { error } = await ApiClient.User.Connect({ email, password });
      if (error) {
        error.status === 403
          ? setError('Login fehlgeschlagen')
          : setError('Verbinden von Usern fehlgeschlagen');
        return;
      }
      signIn('google', {
        callbackUrl: router.query.callbackUrl?.toString() ?? '/',
      });
    },
    [router.query.callbackUrl]
  );

  return (
    <AuthenticationWrapper>
      <AuthLayout
        title="Bestätige die Verbindung mit deinem Google-Account"
        icon={<Google />}
      >
        <CredentialsForm
          showError={setError}
          initialEmail={router.query.email?.toString()}
          onLogin={onLogin}
        />
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
      </AuthLayout>
    </AuthenticationWrapper>
  );
};

export default LinkPage;
