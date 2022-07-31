import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Drawer, Grid } from '@mui/material';
import React, { FC, useContext, useEffect } from 'react';

import { CustomerContext } from '../../context/CustomerContext';
import CustomerForm from './Form/CustomerForm';
import CustomersTable from './Table/CustomersTable';

type CustomerPageProps = {
  customers: ICustomerWithOrders[];
};

const CustomersPage: FC<CustomerPageProps> = ({ customers }) => {
  const { setCustomers, selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  useEffect(() => {
    setCustomers(customers);
  }, []);

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
