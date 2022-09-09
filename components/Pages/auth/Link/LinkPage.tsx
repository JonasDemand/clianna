import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import { Google } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { FC, useCallback, useState } from 'react';

import AuthLayout from '../AuthLayout';
import CredentialsForm from '../CredentailsForm';

const LinkPage: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [error, setError] = useState<string>();

  const onLogin = useCallback(
    async (email: string, password: string) => {
      const oldUserId = session?.user.id;
      const signInResponse = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!signInResponse?.ok) {
        setError('Login fehlgeschlagen');
        return;
      }
    },
    [session?.user.id]
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
