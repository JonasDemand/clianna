'use client';

import { LOCALSTORAGE_JWT_KEY } from '@consts/api';
import { useApiContext } from '@context/ApiContext';
import { Lock } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FC, useCallback, useEffect, useState } from 'react';

import AuthLayout from './AuthLayout';
import CredentialsForm from './CredentailsForm';

const LoginPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { Client, setToken } = useApiContext();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_JWT_KEY))
      router.replace(searchParams?.get('callbackUrl')?.toString() ?? '/');
  }, [router, searchParams]);

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
      router.replace(searchParams?.get('callbackUrl')?.toString() ?? '/');
    },
    [Client.user, router, searchParams, setToken]
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
