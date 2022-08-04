import { TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';

const FormInput: FC<TextFieldProps> = (props) => {
  return (
    <TextField
      variant="filled"
      fullWidth
      type="text"
      {...props}
      value={props.value ?? ''}
    />
  );
};

export default FormInput;
