import MuiTextField from '@components/External/MuiTextField';
import { Box } from '@mui/material';
import { ChangeEvent, FC, useCallback, useState } from 'react';

export type PasswordFormProps = {
  showOldPassword?: boolean;
  showRepeatPassword?: boolean;
  showValidation: boolean;
  setShowValidation: (value: boolean) => void;
  onChange: (value: string, valid: boolean) => void;
  onOldPasswordChange?: (value: string) => void;
};

const PasswordForm: FC<PasswordFormProps> = ({
  showValidation,
  showOldPassword = false,
  showRepeatPassword = false,
  onChange,
  onOldPasswordChange,
  setShowValidation,
}) => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);

  const validate = useCallback(() => {
    setRepeatError(false);
    const valid = !showRepeatPassword || password === repeatPassword;
    setRepeatError(!valid);
    return valid;
  }, [showRepeatPassword, password, repeatPassword]);

  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      setPassword(newValue);
      onChange(newValue, validate());
    },
    [onChange, validate]
  );
  const onChangeOldPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      setOldPassword(newValue);
      onOldPasswordChange && onOldPasswordChange(newValue);
    },
    [onOldPasswordChange]
  );
  const onChangeRepeatPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setRepeatPassword(e.target.value);
      onChange(password, validate());
    },
    [onChange, password, validate]
  );

  const passwordInputRef = useCallback(
    (input: any) => input && !password && input.focus(),
    [password]
  );

  return (
    <Box onFocus={() => setShowValidation(false)}>
      {showOldPassword && (
        <MuiTextField
          type="password"
          label="Altes Passwort"
          fullWidth
          required
          autoComplete={'current-password'}
          value={oldPassword}
          onChange={onChangeOldPassword}
          sx={{ my: 1 }}
        />
      )}
      <MuiTextField
        type="password"
        label="Passwort"
        fullWidth
        required
        autoComplete={showRepeatPassword ? 'new-password' : 'current-password'}
        value={password}
        inputRef={passwordInputRef}
        onChange={onChangePassword}
        sx={{ my: 1 }}
      />
      {showRepeatPassword && (
        <MuiTextField
          type="password"
          label="Passwort wiederholen"
          fullWidth
          required
          autoComplete="new-password"
          value={repeatPassword}
          error={showValidation && repeatError && !!repeatPassword}
          helperText={
            showValidation &&
            repeatError &&
            repeatPassword &&
            'Passwort stimmt nicht überein'
          }
          disabled={!password}
          onChange={onChangeRepeatPassword}
          sx={{ my: 1 }}
        />
      )}
    </Box>
  );
};

export default PasswordForm;
