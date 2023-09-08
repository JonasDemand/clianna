import { TextField, TextFieldProps } from '@mui/material';
import React, { FC } from 'react';

const MuiTextField: FC<TextFieldProps> = (props) => (
  <TextField
    variant="outlined"
    fullWidth
    type="text"
    {...props}
    value={props.value !== null ? props.value : ''}
  />
);

export default MuiTextField;
