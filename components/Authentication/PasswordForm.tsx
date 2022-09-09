import MuiTextField from '@components/External/MuiTextField';
import { Box } from '@mui/material';
import { ChangeEvent, FC, useCallback, useState } from 'react';

export type PasswordFormProps = {
  showOldPassword?: boolean;
  showRepeatPassword?: boolean;
  focusPassword?: boolean;
  showValidation: boolean;
  setShowValidation: (value: boolean) => void;
  onChange: (value: string, valid: boolean) => void;
  onOldPasswordChange?: (value: string) => void;
};

const PasswordForm: FC<PasswordFormProps> = ({
  showValidation,
  showOldPassword = false,
  showRepeatPassword = false,
  focusPassword = false,
  onChange,
  onOldPasswordChange,
  setShowValidation,
}) => {
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatError, setRepeatError] = useState(false);

  const _onChange = useCallback(
    (password: string, repeatPassword: string) => {
      setRepeatError(false);
      const valid = !showRepeatPassword || password === repeatPassword;
      setRepeatError(!valid);
      onChange(password, valid);
    },
    [onChange, showRepeatPassword]
  );
  const onChangeOldPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      setOldPassword(newValue);
      onOldPasswordChange && onOldPasswordChange(newValue);
    },
    [onOldPasswordChange]
  );
  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setPassword(newValue);
      _onChange(newValue, repeatPassword);
    },
    [_onChange, repeatPassword]
  );
  const onChangeRepeatPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setRepeatPassword(newValue);
      _onChange(password, newValue);
    },
    [_onChange, password]
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
        inputRef={focusPassword ? passwordInputRef : undefined}
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
