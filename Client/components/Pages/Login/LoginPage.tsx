'use client';

import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import { Lock } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import { generateCookiesFromTokens } from '@utils/auth';
import useApiClient from 'hooks/useApiClient';
import useSession from 'hooks/useSession';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';

import AuthLayout from './AuthLayout';

const LoginPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateSession } = useSession();
  const ApiClient = useApiClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmitForm = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      setShowPasswordValidation(true);
      setLoading(true);

      const { data, error } = await ApiClient.user.authenticateCreate(
        {
          email,
          password,
        },
        { dontCheckJwt: true }
      );
      setLoading(false);

      if (error || !data) {
        setError(true);
        return;
      }
      const cookies = generateCookiesFromTokens(data);
      if (!cookies) {
        setError(true);
        return;
      }

      updateSession(cookies);
      router.push(searchParams.get('redirectUrl') ?? '/');
    },
    [ApiClient, email, password, router, searchParams, updateSession]
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
          Login fehlgeschlagen. Kontaktiere einen Administrator um den Account
          zu aktivieren.
        </Alert>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
