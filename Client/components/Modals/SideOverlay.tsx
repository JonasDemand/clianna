import MuiButton from '@components/External/MuiButton';
import { Divider, Drawer, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, {
  FC,
  FormEventHandler,
  ReactNode,
  useCallback,
  useState,
} from 'react';

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
        <Divider />
        <Box
          sx={{
            flex: '1 1 auto',
            overflow: 'auto',
            py: 2,
          }}
        >
          {children}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <MuiButton
              fullWidth
              variant="contained"
              color="error"
              onClick={_onClose}
              disabled={loading}
            >
              Abbrechen
            </MuiButton>
          </Grid>
          <Grid item xs={6}>
            <MuiButton
              loadingButton
              fullWidth
              color="success"
              type="submit"
              loading={loading}
            >
              Speichern
            </MuiButton>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideOverlay;
