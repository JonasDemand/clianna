import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useApiContext } from '@context/ApiContext';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { Customer } from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import { useCustomerContext } from '../../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

const CustomersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    filteredCustomers,
    activeColumns,
    searchText,
  } = useCustomerContext();
  const { Client } = useApiContext();

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );

  const onCloseOverlay = useCallback(() => {
    if (!selected) return;
    let newCustomers = [...customers];

    const index = newCustomers.findIndex(
      (customer) => customer.id === selected.id
    );
    newCustomers[index] = {
      ...newCustomers[index],
      documents: selected.documents,
    };
    setCustomers(newCustomers);
    setSelected(null);
  }, [customers, selected, setCustomers, setSelected]);
  const onCloseDialog = useCallback(() => setCustomerToDelete(null), []);

  const onConfirmDialog = useCallback(async () => {
    if (!customerToDelete?.id) return;
    const { error } = await Client.customer.customerDelete(customerToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Kunde fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Kunde gelöscht', { variant: 'success' });
    setCustomerToDelete(null);
    setCustomers(
      customers.filter((customer) => customer.id !== customerToDelete.id)
    );
  }, [
    Client.customer,
    customerToDelete?.id,
    customers,
    enqueueSnackbar,
    setCustomers,
  ]);

  const onSaveOverlay = useCallback(async () => {
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
    let create = selected.id === EId.Create;
    let newCustomers = [...customers];
    if (create) {
      const { error, data } = await Client.customer.customerCreate(selected);
      if (error || !data) {
        enqueueSnackbar('Erstellen von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newCustomers.push(data);
    } else {
      const { error, data } = await Client.customer.customerUpdate(
        selected.id!,
        selected
      );
      if (error || !data) {
        enqueueSnackbar('Aktualisieren von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newCustomers.findIndex(
        (customer) => customer.id === data!.id
      );
      newCustomers[index] = data;
    }
    setCustomers(newCustomers);
    setSelected(null);
    enqueueSnackbar('Erfolgreich Kunde erstellt', { variant: 'success' });
  }, [
    Client.customer,
    customers,
    enqueueSnackbar,
    selected,
    setCustomers,
    setSelected,
  ]);

  const onRowClick = useCallback(
    ({ row }: { row: Customer }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<Customer>
        header={<CustomersTableHeader />}
        rows={filteredCustomers}
        columns={activeColumns}
        onRowClick={onRowClick}
        onDelete={setCustomerToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Kunde bearbeiten"
        open={!!selected}
        onClose={onCloseOverlay}
        onSave={onSaveOverlay}
      >
        <CustomerForm />
      </SideOverlay>
      <ConfirmDialog
        open={!!customerToDelete}
        title="Kunde löschen"
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist Du dir sicher, dass Du diesen Kunden löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getCustomerLabel(customerToDelete)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default CustomersPage;
