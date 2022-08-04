import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Box } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import { concertToCustomer } from '@utils/api/customers';
import {
  createCustomer,
  revalidate,
  updateCustomer,
} from '@utils/api/requests/customers';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext } from 'react';

import { CustomerContext } from '../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

const CustomersPage: FC = () => {
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    filteredCustomers,
    activeColumns,
  } = useContext(CustomerContext) as CustomerContextType;

  const { enqueueSnackbar } = useSnackbar();

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
        `Erfolgreich Kunde ${create ? 'erstellt' : 'aktualisiert'}`,
        { variant: 'success' }
      );
    } catch {
      enqueueSnackbar(
        `${create ? 'Erstellen' : 'Aktualisieren'} von Kunde
          fehlgeschlagen`,
        { variant: 'error' }
      );
      return;
    }

    revalidate();
  }, [customers, selected]);
  const onSelectionModelChange = useCallback(
    (model: GridSelectionModel) => {
      if (selected?.id === -1 && !model[0]) return;
      setSelected(
        filteredCustomers.find(
          (customer) => customer.id === model[0]
        ) as ICustomerWithOrders
      );
    },
    [filteredCustomers, selected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <TablePage<ICustomerWithOrders>
        header={<CustomersTableHeader />}
        rows={filteredCustomers}
        columns={activeColumns}
        selectionModel={selected ? [selected.id] : []}
        onSelectionModelChange={onSelectionModelChange}
      />
      <SideOverlay
        heading="Kundenbearbeitung"
        open={!!selected}
        onClose={onClose}
        onSave={onSave}
      >
        <CustomerForm />
      </SideOverlay>
    </Box>
  );
};

export default CustomersPage;
