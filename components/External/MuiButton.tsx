import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Button, ButtonProps } from '@mui/material';
import { FC } from 'react';

type MuiButtonProps = ButtonProps &
  LoadingButtonProps & {
    loadingButton?: boolean;
  };

const MuiButton: FC<MuiButtonProps> = ({ loadingButton = false, ...props }) =>
  loadingButton ? (
    <LoadingButton
      variant="contained"
      loadingPosition="center"
      startIcon={<></>} //https://github.com/mui/material-ui/issues/31235
      {...props}
    >
      {props.children}
    </LoadingButton>
  ) : (
    <Button variant="contained" {...props}>
      {props.children}
    </Button>
  );

export default MuiButton;
