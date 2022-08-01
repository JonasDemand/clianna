import { LockOutlined } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import React, { FC } from 'react';

type LoginFormProps = { csrfToken: string | undefined; error: boolean };

export const LoginForm: FC<LoginFormProps> = ({ csrfToken, error }) => {
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
          }}
        >
          Anmelden
        </Button>
      </Box>
    </Box>
  );
};
