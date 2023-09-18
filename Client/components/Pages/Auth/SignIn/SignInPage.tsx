import { Lock } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useEffect, useState } from 'react';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const SignInPage: FC = () => {
  const router = useRouter();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (router.query.error)
      setError(
        'Login fehlgeschlagen. Kontaktiere einen Administrator um den Account zu aktivieren.'
      );
  }, [router.query.error]);

  const onLogin = useCallback(
    async (email: string, password: string) => {
      /*TODOsignIn('credentials', {
        email,
        password,
        callbackUrl: router.query.callbackUrl?.toString() ?? '/',
      });*/
    },
    [router.query.callbackUrl]
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
