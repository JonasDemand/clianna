'use client';

import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import {
  SESSION_JWT_COOKIE_NAME,
  SESSION_JWT_VALID_COOKIE_NAME,
  SESSION_REFRESHTOKEN_COOKIE_NAME,
} from '@consts/auth';
import { Lock } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import useApiClient from 'hooks/useApiClient';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { useCookies } from 'react-cookie';

import AuthLayout from './AuthLayout';

const LoginPage: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setCookie] = useCookies();
  const client = useApiClient();

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

      const { data, error } = await client.user.authenticateCreate({
        email,
        password,
      });
      setLoading(true);

      if (
        error ||
        !data ||
        !data.accessToken ||
        !data.refreshToken ||
        !data.accessTokenExpireDate ||
        !data.refreshTokenExpireDate
      ) {
        setError(true);
        return;
      }

      const refreshTokenExpireDate = new Date(data.refreshTokenExpireDate); //Somehow JS Date needs to be re-created
      setCookie(SESSION_JWT_COOKIE_NAME, data.accessToken, {
        expires: refreshTokenExpireDate, // jwt needs to be held for longer to "authenticate" to refresh api
      });
      setCookie(SESSION_JWT_VALID_COOKIE_NAME, true, {
        expires: new Date(data.accessTokenExpireDate),
      });
      setCookie(SESSION_REFRESHTOKEN_COOKIE_NAME, data.refreshToken, {
        expires: refreshTokenExpireDate,
      });
      router.push(searchParams.get('redirectUrl') ?? '/');
    },
    [client.user, email, password, router, searchParams, setCookie]
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
