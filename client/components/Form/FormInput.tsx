import MuiTextField from '@components/External/MuiTextField';
import { TextFieldProps } from '@mui/material';
import React, { FC } from 'react';

const FormTextField: FC<TextFieldProps> = (props) => {
  return <MuiTextField variant="filled" {...props} />;
};

export default FormTextField;
