import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FC, ReactNode } from 'react';

export type ConfirmDialogProps = {
  title: string;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  children: ReactNode;
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  open,
  onConfirm,
  onClose,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{ bgcolor: 'secondary.main', color: 'whitesmoke', mb: 2 }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Nein
        </Button>
        <Button color="primary" onClick={onConfirm}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
