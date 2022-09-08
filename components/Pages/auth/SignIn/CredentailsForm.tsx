import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import { ArrowBack } from '@mui/icons-material';
import { Box, Paper, Slide } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FC, useCallback, useState } from 'react';

import PasswordForm from '../../../Authentication/PasswordForm';

export type CredentialsFormProps = {
  showError: (message: string) => void;
};

const CredentialsForm: FC<CredentialsFormProps> = ({ showError }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  const onSubmitForm = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);
      try {
        if (!showPassword) {
          const validationResponse = await ApiClient.Instance.User.Validate(
            email
          );
          setShowPassword(true);
          setNewAccount(validationResponse.valid);
          setLoading(false);
          return;
        }

        setShowPasswordValidation(true);
        if (!passwordValid) return;

        if (newAccount)
          await ApiClient.Instance.User.UpsertCredentials({ email, password });

        signIn('credentials', {
          email,
          password,
          callbackUrl: router.query.callbackUrl?.toString() ?? '/',
        });
      } catch {
        showError('Unbekannter Fehler');
      } finally {
        setLoading(false);
        return;
      }
    },
    [
      email,
      newAccount,
      password,
      passwordValid,
      router.query.callbackUrl,
      showError,
      showPassword,
    ]
  );

  const onClickBack = useCallback(() => setShowPassword(false), []);

  const onChangePassword = useCallback((value: string, valid: boolean) => {
    setPassword(value);
    setPasswordValid(valid);
  }, []);
  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const inputRefEmail = useCallback((input: any) => input && input.focus(), []);

  return (
    <Box component="form" onSubmit={onSubmitForm}>
      <MuiButton
        variant="text"
        startIcon={<ArrowBack />}
        disabled={!showPassword}
        onClick={onClickBack}
        sx={{ my: 1 }}
      >
        Zurück
      </MuiButton>
      <MuiTextField
        name="email"
        type="email"
        label="E-Mail"
        autoComplete="email"
        fullWidth
        required
        disabled={showPassword}
        value={email}
        inputRef={inputRefEmail}
        onChange={onChangeEmail}
        sx={{ my: 1 }}
      />
      <Slide direction="right" in={showPassword} mountOnEnter unmountOnExit>
        <Paper sx={{ bgcolor: 'unset', boxShadow: 'none' }}>
          <PasswordForm
            focusPassword
            showRepeatPassword={newAccount}
            showValidation={showPasswordValidation}
            setShowValidation={setShowPasswordValidation}
            onChange={onChangePassword}
          />
        </Paper>
      </Slide>
      <MuiButton
        loadingButton
        loading={loading}
        type="submit"
        color="success"
        fullWidth
        sx={{ my: 1 }}
      >
        {!showPassword
          ? 'Weiter mit E-Mail'
          : newAccount
          ? 'Registrieren'
          : 'Anmelden'}
      </MuiButton>
    </Box>
  );
};

export default CredentialsForm;
