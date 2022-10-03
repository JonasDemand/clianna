import MuiButton from '@components/External/MuiButton';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FC, ReactNode, useCallback, useRef, useState } from 'react';

export type ConfirmDialogProps = {
  title: string;
  open: boolean;
  confirmLabel?: string;
  abortLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
  children: ReactNode;
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  open,
  confirmLabel = 'Ja',
  abortLabel = 'Nein',
  onConfirm,
  onClose,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>();

  const _onConfirm = useCallback(async () => {
    if (!formRef.current?.reportValidity()) return;

    setLoading(true);
    await onConfirm();
    setLoading(false);
  }, [onConfirm]);

  const _onClose = useCallback(() => {
    if (loading) return;
    onClose();
  }, [loading, onClose]);

  return (
    <Dialog open={open} onClose={_onClose} fullWidth>
      <DialogTitle
        sx={{ bgcolor: 'secondary.main', color: 'whitesmoke', mb: 2 }}
      >
        {title}
      </DialogTitle>
      <Box component="form" ref={formRef}>
        <DialogContent>
          <DialogContentText align="center" component="div">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton
            variant="text"
            color="error"
            onClick={_onClose}
            disabled={loading}
          >
            {abortLabel}
          </MuiButton>
          <MuiButton
            loadingButton
            loading={loading}
            variant="text"
            color="success"
            onClick={_onConfirm}
          >
            {confirmLabel}
          </MuiButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
