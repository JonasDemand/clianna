import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { columns } from '@consts/customers';
import { CustomerContextType, ShowCustomers } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Grid } from '@mui/material';
import { GridRowParams, GridSelectionModel } from '@mui/x-data-grid';
import { concertToCustomer } from '@utils/api/customers';
import {
  createCustomer,
  revalidate,
  updateCustomer,
} from '@utils/api/requests/customers';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';

import { CustomerContext } from '../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

type CustomersPageProps = {
  customers: ICustomerWithOrders[];
};

const CustomersPage: FC<CustomersPageProps> = ({ customers }) => {
  const {
    setCustomers,
    selected,
    setSelected,
    showCustomers,
    filteredCustomers,
    activeColumns,
  } = useContext(CustomerContext) as CustomerContextType;

  const { enqueueSnackbar } = useSnackbar();
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
  const currentColumns = useMemo(
    () => columns.filter((column) => activeColumns.includes(column.headerName)),
    [activeColumns]
  );

  const onClose = useCallback(() => setSelected(null), []);
  const onSave = useCallback(async () => {
    if (!selected) return;
    if (
      isEqual(
        selected,
        customers.find((customer) => customer.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }
    let create = selected.id === -1;
    let newCustomers = [...customers];
    let newCust = selected;
    try {
      if (create) {
        newCust = await createCustomer(concertToCustomer(selected));
        newCustomers.push(newCust);
      } else {
        newCust = await updateCustomer(
          selected.id,
          concertToCustomer(selected)
        );
        const index = newCustomers.findIndex(
          (customer) => customer.id === newCust.id
        );
        newCustomers[index] = newCust;
      }
      setSelected(null);
      setCustomers(newCustomers);
      enqueueSnackbar(
        `Erfolgreich Kunde ${newCust.id} ${
          create ? 'erstellt' : 'aktualisiert'
        }`,
        { variant: 'success' }
      );
    } catch {
      enqueueSnackbar(
        `${create ? 'Erstellen' : 'Aktualisieren'} von Kunde ${newCust.id}
          fehlgeschlagen`,
        { variant: 'error' }
      );
      return;
    }

    revalidate();
  }, [customers, selected]);
  const getRowClassName = useCallback(
    (params: GridRowParams<ICustomerWithOrders>) =>
      params.row.disabled ? 'row-disabled' : '',
    []
  );
  const onSelectionModelChange = useCallback(
    (model: GridSelectionModel) => {
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
    },
    [filteredCustomers, selected]
  );

  return (
    <Grid
      sx={{
        width: 1,
        height: 1,
        margin: 0,
      }}
      container
    >
      <TablePage<ICustomerWithOrders>
        header={<CustomersTableHeader />}
        rows={visibleCustomers}
        columns={currentColumns}
        getRowClassName={getRowClassName}
        selectionModel={selected ? [selected.id] : []}
        onSelectionModelChange={onSelectionModelChange}
      />
      <SideOverlay open={!!selected} onClose={onClose} onSave={onSave}>
        <CustomerForm />
      </SideOverlay>
    </Grid>
  );
};

export default CustomersPage;
