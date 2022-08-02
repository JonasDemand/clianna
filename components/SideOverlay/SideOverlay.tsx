import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { Delete, Save } from '@mui/icons-material';
import { Button, Drawer, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { FC, ReactNode, useCallback, useContext } from 'react';

export type SideOverlayProps = {
  children: ReactNode;
  open: boolean;
  onSave: () => void | Promise<void>;
  onClose: () => void;
};

const SideOverlay: FC<SideOverlayProps> = ({
  children,
  open,
  onSave,
  onClose,
}) => {
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;

  const _onSave = useCallback(async () => {
    setShowBackdrop(true);
    await onSave();
    setShowBackdrop(false);
  }, [onSave]);

  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
      <Box
        sx={{
          width: { xs: 1, md: 'calc(100vw/2)' },
          p: 1,
          display: 'flex',
          flexFlow: 'column',
          height: 1,
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
          }}
        >
          {children}
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={onClose}
            >
              Abbrechen
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<Save />}
              onClick={_onSave}
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideOverlay;
