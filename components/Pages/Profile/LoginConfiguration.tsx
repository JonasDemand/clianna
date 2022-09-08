import PasswordForm from '@components/Authentication/PasswordForm';
import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import FormSection from '@components/Form/FormSection';
import { Save } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import GoogleButton from 'react-google-button';

const LoginConfiguration: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [showValidation, setShowValidation] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    session?.user?.email && setEmail(session.user.email);
  }, [session?.user?.email]);

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const onClickGoogleButton = useCallback(
    () =>
      signIn('google', {
        callbackUrl: `${router.basePath}/auth/link?email=${session?.user.email}`,
      }),
    [router.basePath, session?.user.email]
  );

  return (
    <Grid container spacing={2} component="form" sx={{ mb: 2 }}>
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
            showOldPassword={session?.user.credentials}
            showRepeatPassword
            showValidation={showValidation}
            setShowValidation={setShowValidation}
            onChange={console.log}
            onOldPasswordChange={console.log}
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
