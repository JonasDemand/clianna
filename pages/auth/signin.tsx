import CredentialsForm from '@components/Authentication/CredentailsForm';
import { LockOutlined } from '@mui/icons-material';
import { Alert, Avatar, Box, Divider, Typography } from '@mui/material';
import { getScope } from '@utils/oauth';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import GoogleButton from 'react-google-button';

export type SignInProps = {
  existingEmails: string[];
};

const SignIn: NextPage = () => {
  const router = useRouter();
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
        <CredentialsForm />
        <Box sx={{ my: 2, '.GoogleButton': { width: '100% !important' } }}>
          <GoogleButton
            className="GoogleButton"
            label="Mit Google anmelden"
            onClick={() =>
              signIn(
                'google',
                {
                  callbackUrl: (router.query.callbackUrl as string) ?? '/',
                },
                new URLSearchParams({
                  scope: getScope(),
                })
              )
            }
          />
        </Box>
        {router.query.error && (
          <Alert variant="filled" severity="error">
            Login fehlgeschlagen
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SignIn;
