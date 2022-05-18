import { FunctionComponent, useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import CustomersTable from './Table/CustomersTable';
import CustomerForm from './Form/CustomerForm';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../@types/customer';
import { CustomerContext } from '../../context/customerContext';

type CustomerPageProps = {
  customers: ICustomerWithOrders[];
};

const CustomersPage: FunctionComponent<CustomerPageProps> = ({ customers }) => {
  const { setCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;
  useEffect(() => {
    setCustomers(customers);
    setFilteredCustomers(customers);
  }, [customers]);
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box sx={{ width: 0.5, height: 1, pr: 1 }}>
        <CustomersTable />
      </Box>
      <Box sx={{ width: 0.5, height: 1, pl: 1 }}>
        <CustomerForm />
      </Box>
    </Box>
  );
};

export default CustomersPage;
