'use client';

import { Lock } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import React, { FC, useCallback, useEffect, useState } from 'react';

import AuthLayout from './AuthLayout';
import CredentialsForm from './CredentailsForm';

const LoginPage: FC = () => {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (searchParams.get('error'))
      setError(
        'Login fehlgeschlagen. Kontaktiere einen Administrator um den Account zu aktivieren.'
      );
  }, [searchParams]);

  const onLogin = useCallback(
    async (email: string, password: string) => {
      signIn('credentials', {
        email,
        password,
        callbackUrl: searchParams.get('callbackUrl')?.toString() ?? '/',
      });
    },
    [searchParams]
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

export default LoginPage;
