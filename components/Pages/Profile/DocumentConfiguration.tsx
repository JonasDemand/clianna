import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import MuiTooltip from '@components/External/MuiTooltip';
import FormSection from '@components/Form/FormSection';
import { CreateNewFolder, Folder } from '@mui/icons-material';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ApiClient } from '@utils/api/client';
import { refreshSession } from '@utils/nextauth';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { FC, MouseEvent, useCallback, useState } from 'react';

const DocumentConfiguration: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();
  const router = useRouter();

  const [rootfolderLoading, setRootfolderLoading] = useState(false);

  const onClickDriveAccess = useCallback(
    () =>
      signIn(
        'google',
        {
          callbackUrl: `${router.asPath}?createRootfolder=true`,
        },
        new URLSearchParams({
          gapiAccess: 'true',
        })
      ),
    [router.asPath]
  );
  const onClickCreateRootfolder = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setRootfolderLoading(true);
      const createFolderResponse = await ApiClient.Document.CreateRootFolder();
      await refreshSession();
      setRootfolderLoading(false);
      if (createFolderResponse.error) {
        enqueueSnackbar('Erstellen von Ordner fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Erfolgreich Ordner erstellt', { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  return (
    <FormSection label="Dokumente">
      {session?.user.refreshToken ? (
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
                endAdornment: rootfolderLoading ? (
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    width="auto"
                  >
                    <CircularProgress size={30} />
                  </Grid>
                ) : (
                  <MuiTooltip title="Ordner neu erstellen">
                    <IconButton
                      onClick={onClickCreateRootfolder}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CreateNewFolder />
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
            Um die Google Docs und Drive Integration zu nutzen musst Du Clianna
            erweiterten Zugriff auf dein Google-Konto genehmigen
          </Typography>
          <Box sx={{ mt: 1 }}>
            <MuiTooltip
              title="Es muss  ein Google Account verbunden werden, um Dokumente freizuschalten"
              show={!session?.user.google}
            >
              <MuiButton
                variant="contained"
                disabled={!session?.user.google}
                startIcon={<Folder />}
                onClick={onClickDriveAccess}
              >
                Zugriff genehmigen
              </MuiButton>
            </MuiTooltip>
          </Box>
        </>
      )}
    </FormSection>
  );
};

export default DocumentConfiguration;
