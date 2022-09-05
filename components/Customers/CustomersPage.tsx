import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { BackdropContext } from '@context/BackdropContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { convertToICustomer, getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext, useState } from 'react';

import { CustomerContext } from '../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

const CustomersPage: FC = () => {
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
  } = useContext(CustomerContext) as CustomerContextType;

  const [customerToDelete, setCustomerToDelete] =
    useState<ICustomerWithOrders | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const onClose = useCallback(() => setSelected(null), [setSelected]);
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
        newCust = await ApiClient.Instance.Customer.Create(
          convertToICustomer(selected)
        );
        newCustomers.push(newCust);
      } else {
        newCust = await ApiClient.Instance.Customer.Update(
          selected.id,
          convertToICustomer(selected)
        );
        const index = newCustomers.findIndex(
          (customer) => customer.id === newCust.id
        );
        newCustomers[index] = newCust;
      }
      setCustomers(newCustomers);
      setSelected(null);
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
    }
  }, [customers, enqueueSnackbar, selected, setCustomers, setSelected]);
  const onCopy = useCallback(
    (customer: ICustomerWithOrders) =>
      setSelected({ ...customer, id: -1, orders: [] }),
    [setSelected]
  );
  const deleteSelectedCustomer = useCallback(async () => {
    if (!customerToDelete) return;
    try {
      setCustomerToDelete(null);
      setShowBackdrop(true);
      await ApiClient.Instance.Customer.Delete(customerToDelete.id);
      setCustomers(
        customers.filter((customer) => customer.id !== customerToDelete.id)
      );
      enqueueSnackbar('Erfolgreich Kunde gelöscht', { variant: 'success' });
    } catch {
      enqueueSnackbar('Löschen von Kunde fehlgeschlagen', { variant: 'error' });
    } finally {
      setShowBackdrop(false);
    }
  }, [
    customerToDelete,
    customers,
    enqueueSnackbar,
    setCustomers,
    setShowBackdrop,
  ]);

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
        onCopy={onCopy}
        onDelete={setCustomerToDelete}
      />
      <SideOverlay
        heading="Kundenbearbeitung"
        open={!!selected}
        onClose={onClose}
        onSave={onSave}
      >
        <CustomerForm />
      </SideOverlay>
      <ConfirmDialog
        open={!!customerToDelete}
        title="Kunde löschen"
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => deleteSelectedCustomer()}
      >
        <Typography>
          Bist du dir sicher, dass Du diesen Kunden löschen willst?
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
