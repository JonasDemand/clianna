import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import FormSection from '@components/Form/FormSection';
import { Save } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { refreshSession } from '@utils/nextauth';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';

const LoginConfiguration: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [repeatError, setRepeatError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    session?.user?.email && setEmail(session.user.email);
  }, [session?.user?.email]);

  const validatePassword = useCallback(async () => {
    if (!oldPassword && !newPassword && !repeatPassword) return true;
    setShowValidation(true);
    if (newPassword !== repeatPassword) {
      setRepeatError(true);
      return false;
    }
    let isValid = true;
    if (session?.user.credentials) {
      const validationResponse = await ApiClient.User.ValidateCredentials(
        oldPassword
      );
      if (validationResponse.error || !validationResponse.response)
        isValid = false;
      else isValid = validationResponse.response.valid;
    }
    if (!isValid) {
      setOldPasswordError(true);
      return false;
    }
    return true;
  }, [newPassword, oldPassword, repeatPassword, session?.user.credentials]);

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const onClickGoogleButton = useCallback(
    () =>
      signIn('google', {
        callbackUrl: `${router.basePath}/auth/link?email=${session?.user.email}&callbackUrl=${router.basePath}${router.asPath}`,
      }),
    [router.asPath, router.basePath, session?.user.email]
  );

  const onSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const passwordValid = await validatePassword();
      if (!passwordValid) return;
      setShowValidation(false);

      const updateResponse = await ApiClient.User.Update({
        email,
        password: newPassword ?? undefined,
      });
      await refreshSession();
      setLoading(false);
      if (updateResponse.error) {
        enqueueSnackbar('Aktualisieren von Profil fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Erfolgreich Profil aktualisiert', {
        variant: 'success',
      });

      setOldPassword('');
      setNewPassword('');
      setRepeatPassword('');
    },
    [email, enqueueSnackbar, newPassword, validatePassword]
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
            showOldPassword={session?.user.credentials}
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
          <Grid item>
            <GoogleButton
              label="Google-Account verlinken"
              disabled={session?.user.google}
              onClick={onClickGoogleButton}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginConfiguration;
