import { LockOutlined } from '@mui/icons-material';
import { Alert, Avatar, Box, Divider, Typography } from '@mui/material';
import { getScope } from '@utils/oauth';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { FC, useCallback, useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';

import CredentialsForm from './CredentailsForm';

const LoginPage: FC = () => {
  const router = useRouter();

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (router.query.error) setError('Login fehlgeschlagen');
  }, [router.query.error]);

  const onClickGoogleButton = useCallback(
    () =>
      signIn(
        'google',
        {
          callbackUrl: (router.query.callbackUrl as string) ?? '/',
        },
        new URLSearchParams({
          scope: getScope(),
        })
      ),
    [router.query.callbackUrl]
  );

  return (
    <Box
      sx={{
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: 'secondary.main',
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Anmeldung
        </Typography>
      </Box>
      <Box sx={{ width: { xs: 1, sm: '500px' }, my: 1 }}>
        <Divider />
        <CredentialsForm showError={setError} />
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
      </Box>
    </Box>
  );
};

export default LoginPage;
