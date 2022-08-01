import TablePage from '@components/Table/TablePage';
import { columns } from '@consts/customers';
import { CustomerContextType, ShowCustomers } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Drawer, Grid } from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid';
import React, { FC, useContext, useEffect, useMemo } from 'react';

import { CustomerContext } from '../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form/CustomerForm';

type CustomerPageProps = {
  customers: ICustomerWithOrders[];
};

const CustomersPage: FC<CustomerPageProps> = ({ customers }) => {
  const {
    setCustomers,
    selected,
    setSelected,
    showCustomers,
    filteredCustomers,
    activeColumns,
  } = useContext(CustomerContext) as CustomerContextType;
  useEffect(() => {
    setCustomers(customers);
  }, []);

  const visibleCustomers = useMemo(() => {
    if (showCustomers === ShowCustomers.All) return filteredCustomers;
    const disabledValue = showCustomers === ShowCustomers.Disabled;
    return filteredCustomers.filter(
      (customer) => customer.disabled === disabledValue
    );
  }, [filteredCustomers, showCustomers]);

  return (
    <Grid
      sx={{
        width: 1,
        height: 1,
        margin: 0,
      }}
      container
    >
      <TablePage
        header={<CustomersTableHeader />}
        rows={visibleCustomers}
        columns={columns.filter((column) =>
          activeColumns.includes(column.headerName)
        )}
        getRowClassName={(params: GridRowParams<ICustomerWithOrders>) =>
          params.row.disabled ? 'row-disabled' : ''
        }
        selectionModel={selected ? [selected.id] : []}
        onSelectionModelChange={(model) => {
          if (selected?.id === -1 && !model[0]) return;
          if (selected && model[0] === selected.id) {
            setSelected(null);
            return;
          }
          setSelected(
            filteredCustomers.find(
              (customer) => customer.id === model[0]
            ) as ICustomerWithOrders
          );
        }}
      />
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
