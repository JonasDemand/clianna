'use client';

import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import { Lock } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

import AuthLayout from './AuthLayout';

const LoginPage: FC = () => {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (searchParams.get('error'))
      setError(
        'Login fehlgeschlagen. Kontaktiere einen Administrator um den Account zu aktivieren.'
      );
  }, [searchParams]);

  const onSubmitForm = useCallback(
    (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      setShowPasswordValidation(true);
      setLoading(true);

      signIn('credentials', {
        email,
        password,
        callbackUrl: searchParams.get('callbackUrl')?.toString() ?? '/',
      });
    },
    [email, password, searchParams]
  );
  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const inputRefEmail = useCallback((input: any) => input && input.focus(), []);

  return (
    <AuthLayout title="Anmeldung" icon={<Lock />}>
      <Box component="form" onSubmit={onSubmitForm}>
        <MuiTextField
          name="email"
          type="email"
          label="E-Mail"
          autoComplete="email"
          fullWidth
          required
          value={email}
          inputRef={inputRefEmail}
          onChange={onChangeEmail}
          sx={{ my: 1 }}
        />

        <PasswordForm
          showValidation={showPasswordValidation}
          setShowValidation={setShowPasswordValidation}
          repeatError={repeatError}
          setRepeatError={setRepeatError}
          password={password}
          onPasswordChange={setPassword}
          repeatPassword={repeatPassword}
          onRepeatPasswordChange={setRepeatPassword}
        />

        <MuiButton
          loadingButton
          type="submit"
          color="success"
          fullWidth
          sx={{ my: 1 }}
          loading={loading}
        >
          Anmelden
        </MuiButton>
      </Box>
      {error && (
        <Alert variant="filled" severity="error">
          {error}
        </Alert>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
