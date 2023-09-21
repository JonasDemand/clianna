import { Backdrop, BackdropProps, CircularProgress } from '@mui/material';
import React, { FC } from 'react';

const MuiGlobalBackdrop: FC<BackdropProps> = (props) => (
  <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} {...props}>
    <CircularProgress size={100} />
  </Backdrop>
);

export default MuiGlobalBackdrop;
