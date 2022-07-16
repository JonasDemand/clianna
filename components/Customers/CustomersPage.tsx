import { Grid } from '@mui/material';
import React, { FunctionComponent, useContext, useEffect } from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../@types/database/customer';
import { CustomerContext } from '../../context/customerContext';
import CustomerForm from './Form/CustomerForm';
import CustomersTable from './Table/CustomersTable';

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
    <Grid
      sx={{
        width: 1,
        height: 1,
        margin: 0,
      }}
      container
    >
      <Grid sx={{ pr: 1 }} item xs={6}>
        <CustomersTable />
      </Grid>
      <Grid sx={{ pl: 1 }} item xs={6}>
        <CustomerForm />
      </Grid>
    </Grid>
  );
};

export default CustomersPage;
