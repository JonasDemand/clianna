import MuiTextField from '@components/External/MuiTextField';
import { Box } from '@mui/material';
import React, { ChangeEvent, FC, useCallback } from 'react';

export type PasswordFormProps = {
  required?: boolean;
  showOldPassword?: boolean;
  showRepeatPassword?: boolean;
  focusPassword?: boolean;
  showValidation: boolean;
  repeatError?: boolean;
  oldPasswordError?: boolean;
  password: string;
  oldPassword?: string;
  repeatPassword?: string;
  onPasswordChange: (value: string) => void;
  onOldPasswordChange?: (value: string) => void;
  onRepeatPasswordChange?: (value: string) => void;
  setShowValidation: (value: boolean) => void;
  setRepeatError?: (value: boolean) => void;
  setOldPasswordError?: (value: boolean) => void;
};

const PasswordForm: FC<PasswordFormProps> = ({
  required = true,
  showOldPassword = false,
  showRepeatPassword = false,
  focusPassword = false,
  showValidation = false,
  repeatError = false,
  oldPasswordError = false,
  onPasswordChange,
  password,
  setOldPasswordError,
  setRepeatError,
  setShowValidation,
  oldPassword,
  onOldPasswordChange,
  onRepeatPasswordChange,
  repeatPassword,
}) => {
  const onChangeOldPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onOldPasswordChange && onOldPasswordChange(e.target.value);
    },
    [onOldPasswordChange]
  );
  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onPasswordChange(e.target.value);
      setOldPasswordError && setOldPasswordError(false);
      setRepeatError && setRepeatError(false);
    },
    [onPasswordChange, setOldPasswordError, setRepeatError]
  );
  const onChangeRepeatPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onRepeatPasswordChange && onRepeatPasswordChange(e.target.value);
      setRepeatError && setRepeatError(false);
    },
    [onRepeatPasswordChange, setRepeatError]
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
          required={required}
          autoComplete="current-password"
          value={oldPassword}
          error={showValidation && oldPasswordError}
          helperText={
            showValidation && oldPasswordError && 'Passwort ist inkorrekt'
          }
          onChange={onChangeOldPassword}
          sx={{ my: 1 }}
        />
      )}
      <MuiTextField
        type="password"
        label="Passwort"
        fullWidth
        required={required}
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
          required={required}
          autoComplete="new-password"
          value={repeatPassword}
          error={showValidation && repeatError}
          helperText={
            showValidation && repeatError && 'Passwörter stimmen nicht überein'
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
