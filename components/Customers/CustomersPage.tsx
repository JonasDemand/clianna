import { FunctionComponent, useContext } from 'react';
import { Box } from '@mui/material';
import CustomersTable from './CustomersTable';
import CustomerForm from './Form/CustomerForm';
import { CustomerContext } from '../../context/customerContext';
import { CustomerContextType } from '../../@types/customer';

const CustomersPage: FunctionComponent = () => {
  const { selected } = useContext(CustomerContext) as CustomerContextType;
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ width: selected ? 0.5 : 1, height: 1, pr: 1 }}>
        <CustomersTable />
      </Box>
      {selected && (
        <Box sx={{ width: 0.5, height: 1, pl: 1 }}>
          <CustomerForm />
        </Box>
      )}
    </Box>
  );
};

export default CustomersPage;
