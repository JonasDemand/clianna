import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext, useState } from 'react';

import { CustomerContext } from '../../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

const CustomersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    filteredCustomers,
    activeColumns,
    searchText,
  } = useContext(CustomerContext) as CustomerContextType;

  const [customerToDelete, setCustomerToDelete] =
    useState<ICustomerWithOrders | null>(null);

  const onCloseOverlay = useCallback(() => setSelected(null), [setSelected]);
  const onCloseDialog = useCallback(() => setCustomerToDelete(null), []);

  const onConfirmDialog = useCallback(async () => {
    if (!customerToDelete?.id) return;
    setCustomerToDelete(null);
    setShowBackdrop(true);
    const deleteResponse = await ApiClient.Customer.Delete(customerToDelete.id);
    setShowBackdrop(false);
    if (deleteResponse.error) {
      enqueueSnackbar('Löschen von Kunde fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Kunde gelöscht', { variant: 'success' });
    setCustomers(
      customers.filter((customer) => customer.id !== customerToDelete.id)
    );
  }, [
    customerToDelete,
    customers,
    enqueueSnackbar,
    setCustomers,
    setShowBackdrop,
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
    let create = !selected.id;
    let newCustomers = [...customers];
    if (create) {
      const createResponse = await ApiClient.Customer.Create(selected);
      if (createResponse.error || !createResponse.response) {
        enqueueSnackbar('Erstellen von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      console.log(createResponse, newCustomers);
      newCustomers.push(createResponse.response);
    } else {
      const updateResponse = await ApiClient.Customer.Update(
        selected.id!,
        selected
      );
      if (updateResponse.error || !updateResponse.response) {
        enqueueSnackbar('Aktualisieren von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newCustomers.findIndex(
        (customer) => customer.id === updateResponse.response!.id
      );
      newCustomers[index] = updateResponse.response;
    }
    setCustomers(newCustomers);
    setSelected(null);
    enqueueSnackbar(
      `Erfolgreich Kunde ${create ? 'erstellt' : 'aktualisiert'}`,
      { variant: 'success' }
    );
  }, [customers, enqueueSnackbar, selected, setCustomers, setSelected]);

  const onCopyRow = useCallback(
    (customer: ICustomerWithOrders) =>
      setSelected({ ...customer, id: undefined, orders: [] }),
    [setSelected]
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
        onEdit={setSelected}
        onCopy={onCopyRow}
        onDelete={setCustomerToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Kundenbearbeitung"
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
        <Typography>
          Bist Du dir sicher, dass Du diesen Kunden löschen willst?
        </Typography>
        <Typography marginBottom={2}>
          Alle Zuordnungen des Kundens gehen verloren.
        </Typography>
        <Typography fontWeight="bold">
          {getCustomerLabel(customerToDelete)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default CustomersPage;
