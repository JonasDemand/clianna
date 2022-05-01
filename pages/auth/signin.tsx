import { LockOutlined } from '@mui/icons-material';
import { Alert, Avatar, Button, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { GetServerSideProps, NextPage } from 'next';
import { getCsrfToken } from 'next-auth/react';

type SignInProps = { csrfToken: string | undefined; error: boolean };

const SignIn: NextPage<SignInProps> = ({ csrfToken, error }) => {
  return (
    <Box
      sx={{
        mt: 8,
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
        <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Anmeldung
        </Typography>
      </Box>
      <Box
        component="form"
        method="post"
        action="/api/auth/callback/credentials"
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <TextField
          name="email"
          type="email"
          label="E-Mail"
          margin="normal"
          autoComplete="email"
          fullWidth
          required
          autoFocus
        />
        <TextField
          name="password"
          type="password"
          label="Passwort"
          margin="normal"
          fullWidth
          required
          autoComplete="current-password"
        />
        {error && <Alert severity="error">Login fehlgeschlagen</Alert>}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Anmelden
        </Button>
      </Box>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: (await getCsrfToken(context)) ?? '',
      error: context.query.error !== undefined,
    } as SignInProps,
  };
};

export default SignIn;
