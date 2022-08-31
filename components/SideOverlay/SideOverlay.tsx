import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { Button, Divider, Drawer, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  FC,
  FormEventHandler,
  ReactNode,
  useCallback,
  useContext,
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
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;

  const _onSave: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setShowBackdrop(true);
        await onSave();
      } finally {
        setShowBackdrop(false);
      }
    },
    [onSave, setShowBackdrop]
  );

  return (
    <Drawer open={open} anchor="right" onClose={onClose}>
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
            >
              Abbrechen
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" color="success" type="submit">
              Speichern
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default SideOverlay;
