import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import GoogleButton from 'react-google-button';

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
      <Box sx={{ mt: 2 }}>
        <GoogleButton
          label="Mit Google anmelden"
          onClick={() =>
            signIn('google', {
              callbackUrl: (router.query.callbackUrl as string) ?? '/',
            })
          }
        />
      </Box>
    </Box>
  );
};

export default SignIn;
