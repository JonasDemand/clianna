import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import { getScope } from '@utils/oauth';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import GoogleButton from 'react-google-button';

export type SignInProps = {
  existingEmails: string[];
};

const SignIn: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
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
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("we're here!");
        }}
      >
        <TextField
          type="email"
          label="E-Mail"
          margin="normal"
          autoComplete="email"
          fullWidth
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button fullWidth variant="contained">
          Weiter mit E-Mail
        </Button>
        <Box sx={{ mt: 2, '.GoogleButton': { width: '100% !important' } }}>
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
      </Box>
    </Box>
  );
};

export default SignIn;
