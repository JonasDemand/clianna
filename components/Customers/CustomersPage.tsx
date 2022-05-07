import { FunctionComponent, useContext } from 'react';
import { Box } from '@mui/material';
import { CustomerContextType } from '../../@types/customer';
import { CustomerContext } from '../../context/customerContext';
import CustomersTable from './CustomersTable';

const CustomersPage: FunctionComponent = () => {
  const { customers, filteredCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 81px)',
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <CustomersTable />
    </Box>
  );
};

export default CustomersPage;
