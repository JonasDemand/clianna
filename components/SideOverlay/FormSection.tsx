import { FormControl, FormGroup, FormLabel } from '@mui/material';
import { FC, ReactNode } from 'react';

export type FormBodyProps = {
  label: string;
  children?: ReactNode | ReactNode[];
};

const FormSection: FC<FormBodyProps> = ({ label, children }) => (
  <FormControl fullWidth>
    <FormLabel sx={{ mb: 1, '&.MuiFormLabel-root': { color: 'GrayText' } }}>
      {label}
    </FormLabel>
    <FormGroup>{children}</FormGroup>
  </FormControl>
);

export default FormSection;
