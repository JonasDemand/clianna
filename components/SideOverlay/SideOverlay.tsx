import { LoadingButton } from '@mui/lab';
import { Button, Divider, Drawer, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FC, FormEventHandler, ReactNode, useCallback, useState } from 'react';

export type SideOverlayProps = {
  children: ReactNode;
  open: boolean;
  heading: string;
  onSave: () => void | Promise<void>;
  onClose: () => void;
};

const SideOverlay: FC<SideOverlayProps> = ({
  children,
  open,
  heading,
  onSave,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const _onSave: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        await onSave();
      } finally {
        setLoading(false);
      }
    },
    [onSave]
  );

  const _onClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  return (
    <Drawer open={open} anchor="right" onClose={_onClose}>
      <Box
        component="form"
        onSubmit={_onSave}
        sx={{
          width: { xs: 1, md: 'calc(100vw/2)' },
          p: 1,
          display: 'flex',
          flexFlow: 'column',
          height: 1,
        }}
      >
        <Typography variant="h6">{heading}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            flex: '1 1 auto',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={onClose}
              disabled={loading}
            >
              Abbrechen
            </Button>
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              fullWidth
              variant="contained"
              color="success"
              type="submit"
              loading={loading}
              loadingPosition="start"
            >
              Speichern
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideOverlay;
