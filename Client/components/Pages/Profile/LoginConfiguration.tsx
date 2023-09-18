import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import FormSection from '@components/Form/FormSection';
import { Save } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';

const LoginConfiguration: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [repeatError, setRepeatError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  /*TODO
  useEffect(() => {
    session?.user?.email && setEmail(session.user.email);
  }, [session?.user?.email]);*/

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const onSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();

      /*TODO
      if (email === session?.user.email && !oldPassword) {
        enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
          variant: 'info',
        });
        return;
      }

      if (oldPassword && newPassword !== repeatPassword) {
        setRepeatError(true);
        setShowValidation(true);
        return;
      }

      setLoading(true);
      const { error } = await ApiClient.({
        email,
        oldPassword,
        password: newPassword,
      });
      if (error) {
        setLoading(false);
        if (error.status === 403) {
          setOldPasswordError(true);
          enqueueSnackbar('Altes Passwort ist nicht korrekt', {
            variant: 'error',
          });
          return;
        }
        enqueueSnackbar('Aktualisieren von Profil fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      await refreshSession();
      setLoading(false);
      enqueueSnackbar('Erfolgreich Profil aktualisiert', {
        variant: 'success',
      });*/
    },
    [email, enqueueSnackbar, newPassword, oldPassword, repeatPassword]
  );

  return (
    <Grid
      container
      spacing={2}
      component="form"
      onSubmit={onSubmit}
      sx={{ mb: 2 }}
    >
      <Grid item xs={12} sx={{ mb: -2 }}>
        <FormSection label="Anmeldung" />
      </Grid>
      <Grid item xs={6}>
        <MuiTextField
          fullWidth
          required
          type="text"
          label="E-Mail"
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ mt: -1 }}>
          <PasswordForm
            showRepeatPassword
            required={false}
            showOldPassword
            showValidation={showValidation}
            setShowValidation={setShowValidation}
            repeatError={repeatError}
            setRepeatError={setRepeatError}
            password={newPassword}
            onPasswordChange={setNewPassword}
            oldPassword={oldPassword}
            onOldPasswordChange={setOldPassword}
            repeatPassword={repeatPassword}
            onRepeatPasswordChange={setRepeatPassword}
            oldPasswordError={oldPasswordError}
            setOldPasswordError={setOldPasswordError}
          />
        </Box>
      </Grid>
      <Grid item container xs={12}>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <MuiButton
              loadingButton
              loading={loading}
              type="submit"
              variant="contained"
              color="success"
              startIcon={<Save />}
            >
              Speichern
            </MuiButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginConfiguration;
