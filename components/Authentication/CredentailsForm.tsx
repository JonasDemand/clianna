import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Paper, Slide, TextField } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FC, useCallback, useState } from 'react';

const CredentialsForm: FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newAccount, setNewAccount] = useState(false);

  const confirmEmail = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!showPassword) {
        try {
          const validationResponse = await ApiClient.Instance.User.Validate(
            email
          );
          setShowPassword(true);
          setNewAccount(validationResponse.valid);
        } catch {
          return;
        }
        return;
      }

      if (newAccount) {
        try {
          if (password !== repeatPassword) {
            alert('!!!!');
            return;
          }
          await ApiClient.Instance.User.Upsert({ email, password });
        } catch {
          return;
        }
      }
      signIn('credentials', {
        email,
        password,

        callbackUrl: (router.query.callbackUrl as string) ?? '/',
      });
    },
    [
      email,
      newAccount,
      password,
      repeatPassword,
      router.query.callbackUrl,
      showPassword,
    ]
  );

  return (
    <Box component="form" onSubmit={confirmEmail}>
      <Button
        startIcon={<ArrowBack />}
        disabled={!showPassword}
        onClick={() => setShowPassword(false)}
        sx={{ my: 1 }}
      >
        Zurück
      </Button>
      <TextField
        name="email"
        type="email"
        label="E-Mail"
        autoComplete="email"
        fullWidth
        required
        disabled={showPassword}
        value={email}
        inputRef={(input) => input && input.focus()}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ my: 1 }}
      />
      <Slide direction="right" in={showPassword} mountOnEnter unmountOnExit>
        <Paper sx={{ bgcolor: 'unset', boxShadow: 'none' }}>
          <TextField
            name="password"
            type="password"
            label="Passwort"
            fullWidth
            required
            autoComplete="current-password"
            value={password}
            inputRef={(input) => input && input.focus()}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ my: 1 }}
          />
          {newAccount && (
            <TextField
              name="repeatPassword"
              type="password"
              label="Passwort wiederholen"
              fullWidth
              required
              autoComplete="current-password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              sx={{ my: 1 }}
            />
          )}
        </Paper>
      </Slide>
      <Button type="submit" fullWidth variant="contained" sx={{ my: 1 }}>
        {!showPassword
          ? 'Weiter mit E-Mail'
          : newAccount
          ? 'Registrieren'
          : 'Anmelden'}
      </Button>
    </Box>
  );
};

export default CredentialsForm;
