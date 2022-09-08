import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import MuiTooltip from '@components/External/MuiTooltip';
import FormSection from '@components/Form/FormSection';
import { Folder, Refresh } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { FC, useCallback } from 'react';

import LoginConfiguration from './LoginConfiguration';

const ProfilePage: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const onClickDriveAccess = useCallback(
    () =>
      signIn(
        'google',
        {
          callbackUrl: router.pathname,
        },
        new URLSearchParams({
          gapiAccess: 'true',
        })
      ),
    [router.pathname]
  );

  return (
    <Grid container justifyContent="center">
      <Grid item sx={{ maxWidth: '800px' }}>
        <LoginConfiguration />
        <FormSection label="Dokumente">
          {session?.user.gapiAccess ? (
            <Grid container>
              <Grid item xs={6}>
                <MuiTextField
                  fullWidth
                  disabled
                  label="Clianna Ordner ID"
                  value={session?.user.cliannaFolderId}
                  onClick={() =>
                    session?.user.cliannaFolderId &&
                    window.open(
                      `https://drive.google.com/drive/folders/${session?.user.cliannaFolderId}`,
                      '_black'
                    )
                  }
                  inputProps={{ sx: { cursor: 'pointer' } }}
                  InputProps={{
                    endAdornment: (
                      <MuiTooltip title="Ordner neu erstellen">
                        <IconButton
                          onClick={async (e) => {
                            e.stopPropagation();
                            await fetch('/api/documents/rootfolder', {
                              method: 'POST',
                            });
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <Refresh />
                        </IconButton>
                      </MuiTooltip>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography>
                Um die Google Docs und Drive Integration zu nutzen musst Du
                Clianna erweiterten Zugriff auf dein Google-Konto genehmigen
              </Typography>
              <Box sx={{ mt: 1 }}>
                <MuiButton
                  variant="contained"
                  disabled={session?.user.gapiAccess}
                  startIcon={<Folder />}
                  onClick={onClickDriveAccess}
                >
                  Zugriff genehmigen
                </MuiButton>
              </Box>
            </>
          )}
        </FormSection>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
