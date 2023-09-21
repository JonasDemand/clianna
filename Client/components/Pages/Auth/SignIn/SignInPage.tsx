import { useApiContext } from '@context/ApiContext';
import { Lock } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useState } from 'react';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const SignInPage: FC = () => {
  const router = useRouter();

  const { Client, setToken } = useApiContext();

  const [error, setError] = useState<string>();

  const onLogin = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await Client.user.authenticateCreate({
        username: email,
        password,
      });
      if (error || !data || !data.token) {
        setError(
          'Login fehlgeschlagen. Kontaktiere einen Administrator um den Account zu aktivieren.'
        );
        return;
      }
      setToken(data.token);
      router.replace(router.query.callbackUrl?.toString() ?? '/');
    },
    [Client.user, router, setToken]
  );

  return (
    <AuthLayout title="Anmeldung" icon={<Lock />}>
      <CredentialsForm showError={setError} onLogin={onLogin} />
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
    </AuthLayout>
  );
};

export default SignInPage;
