import { Box, TextField } from '@mui/material';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

export type PasswordFormProps = {
  showRepeatPassword?: boolean;
  showValidation: boolean;
  setShowValidation: (value: boolean) => void;
  onChange: (value: string, valid: boolean) => void;
};

const PasswordForm: FC<PasswordFormProps> = ({
  showValidation,
  showRepeatPassword = false,
  onChange,
  setShowValidation,
}) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    let valid = password !== '';
    if (valid && showRepeatPassword)
      valid = repeatPassword !== '' && password === repeatPassword;
    setError(!valid);
    onChange(password, valid);
  }, [showRepeatPassword, onChange, password, repeatPassword]);

  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    []
  );
  const onChangeRepeatPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value),
    []
  );

  const passwordInputRef = useCallback(
    (input: any) => input && !password && input.focus(),
    [password]
  );

  return (
    <Box onFocus={() => setShowValidation(false)}>
      <TextField
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
        <TextField
          type="password"
          label="Passwort wiederholen"
          fullWidth
          required
          autoComplete="new-password"
          value={repeatPassword}
          error={showValidation && error && !!repeatPassword}
          helperText={
            showValidation &&
            error &&
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
