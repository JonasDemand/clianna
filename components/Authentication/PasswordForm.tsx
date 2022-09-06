import { Box, TextField } from '@mui/material';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

export type PasswordFormProps = {
  hasToRepeat: boolean;
  showValidation: boolean;
  setShowValidation: (value: boolean) => void;
  onChange: (value: string, valid: boolean) => void;
};

const PasswordForm: FC<PasswordFormProps> = ({
  showValidation,
  hasToRepeat,
  onChange,
  setShowValidation,
}) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    let valid = password !== '';
    if (valid && hasToRepeat)
      valid = repeatPassword !== '' && password === repeatPassword;
    setError(!valid);
    onChange(password, valid);
  }, [hasToRepeat, onChange, password, repeatPassword]);

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
        name="password"
        type="password"
        label="Passwort"
        fullWidth
        required
        autoComplete="current-password"
        value={password}
        inputRef={passwordInputRef}
        onChange={onChangePassword}
        sx={{ my: 1 }}
      />
      {hasToRepeat && (
        <TextField
          name="repeatPassword"
          type="password"
          label="Passwort wiederholen"
          fullWidth
          required
          autoComplete="current-password"
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
