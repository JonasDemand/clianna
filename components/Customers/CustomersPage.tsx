import { Drawer, Grid } from '@mui/material';
import React, { FC, useContext, useEffect } from 'react';

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

const CustomersPage: FC<CustomerPageProps> = ({ customers }) => {
  const { setCustomers, setFilteredCustomers, selected, setSelected } =
    useContext(CustomerContext) as CustomerContextType;
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
      <CustomersTable />
      <Drawer
        open={!!selected}
        anchor="right"
        onClose={() => setSelected(null)}
      >
        <CustomerForm />
      </Drawer>
    </Grid>
  );
};

export default CustomersPage;
