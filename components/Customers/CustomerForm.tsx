import { Box } from '@mui/material';
import { FunctionComponent, useContext } from 'react';
import { CustomerContextType } from '../../@types/customer';
import { CustomerContext } from '../../context/customerContext';

const CustomerForm: FunctionComponent = () => {
  const { selected } = useContext(CustomerContext) as CustomerContextType;
  return (
    <Box sx={{ height: 1, width: 1 }}>Selektiert: {selected?.firstname}</Box>
  );
};

export default CustomerForm;
