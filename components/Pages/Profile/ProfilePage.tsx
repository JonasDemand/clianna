import PasswordForm from '@components/Authentication/PasswordForm';
import FormSection from '@components/Form/FormSection';
import { Folder } from '@mui/icons-material';
import { Alert, Button, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

const ProfilePage: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [showValidation, setShowValidation] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    session?.user.email && setEmail(session.user.email);
  }, [session?.user.email]);

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  const onClickDriveAccess = useCallback(
    () =>
      signIn(
        'google',
        {
          callbackUrl: router.pathname,
        },
        new URLSearchParams({
          gapiAccess: 'true',
          email: session?.user.email ?? '',
        })
      ),
    [router.pathname, session?.user.email]
  );

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        container
        component="form"
        spacing={2}
        sx={{ maxWidth: '800px' }}
      >
        <Grid item xs={12}>
          <Alert severity="warning" variant="filled">
            Diese Seite ist noch im Aufbau, E-Mail und Passwort Änderungen sind
            nicht möglich
          </Alert>
        </Grid>
        <Grid item xs={6}>
          <FormSection label="E-Mail">
            <TextField
              fullWidth
              required
              type="text"
              label="E-Mail"
              value={email}
              onChange={onChangeEmail}
            />
          </FormSection>
        </Grid>
        <Grid item xs={6}>
          <FormSection label="Passwort">
            <Box sx={{ mt: -1 }}>
              <PasswordForm
                showRepeatPassword
                showValidation={showValidation}
                setShowValidation={setShowValidation}
                onChange={() => {}}
              />
            </Box>
          </FormSection>
        </Grid>
        <Grid item xs={12}>
          <FormSection label="Dokumente">
            <Typography>
              Um die Google Docs und Drive Integration zu nutzen musst Du
              Clianna erweiterten Zugriff auf dein Google-Konto genehmigen
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="contained"
                startIcon={<Folder />}
                onClick={onClickDriveAccess}
              >
                {session?.user.gapiAccess
                  ? 'Zugriff genehmigt'
                  : 'Zugriff genehmigen'}
              </Button>
            </Box>
          </FormSection>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
