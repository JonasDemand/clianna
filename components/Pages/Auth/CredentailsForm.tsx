import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import PasswordForm from '../../Authentication/PasswordForm';

export type CredentialsFormProps = {
  showError: (message: string) => void;
  initialEmail?: string;
  onLogin: (
    email: string,
    password: string,
    newAccount: boolean
  ) => Promise<void> | void;
};

const CredentialsForm: FC<CredentialsFormProps> = ({
  showError,
  initialEmail,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newAccount, setNewAccount] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  useEffect(() => {
    if (!initialEmail) return;
    setEmail(initialEmail);
    setShowPassword(true);
  }, [initialEmail]);

  const onSubmitForm = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!showPassword) {
        setLoading(true);
        const validationResponse = await ApiClient.User.ValidateEmail(email);
        setLoading(false);
        if (validationResponse.error || !validationResponse.response) {
          showError('Unbekannter Fehler');
          return;
        }
        setShowPassword(true);
        setNewAccount(validationResponse.response.valid);
        return;
      }

      setShowPasswordValidation(true);
      if (newAccount && password !== repeatPassword) {
        setRepeatError(true);
        return;
      }

      onLogin(email, password, newAccount);
    },
    [
      email,
      newAccount,
      onLogin,
      password,
      repeatPassword,
      showError,
      showPassword,
    ]
  );

  const onClickBack = useCallback(() => setShowPassword(false), []);

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
        disabled={!showPassword || !!initialEmail}
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
      {showPassword && (
        <PasswordForm
          focusPassword
          showRepeatPassword={newAccount}
          showValidation={showPasswordValidation}
          setShowValidation={setShowPasswordValidation}
          repeatError={repeatError}
          setRepeatError={setRepeatError}
          password={password}
          onPasswordChange={setPassword}
          repeatPassword={repeatPassword}
          onRepeatPasswordChange={setRepeatPassword}
        />
      )}
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
