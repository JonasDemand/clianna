import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import { Box } from '@mui/material';
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';

import PasswordForm from '../../Authentication/PasswordForm';

export type CredentialsFormProps = {
  showError: (message: string) => void;
  initialEmail?: string;
  onLogin: (email: string, password: string) => Promise<void> | void;
};

const CredentialsForm: FC<CredentialsFormProps> = ({
  initialEmail,
  onLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);

  useEffect(() => {
    if (!initialEmail) return;
    setEmail(initialEmail);
  }, [initialEmail]);

  const onSubmitForm = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      setShowPasswordValidation(true);

      onLogin(email, password);
    },
    [email, onLogin, password]
  );

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const inputRefEmail = useCallback((input: any) => input && input.focus(), []);

  return (
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
        focusPassword
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
      >
        Anmelden
      </MuiButton>
    </Box>
  );
};

export default CredentialsForm;
