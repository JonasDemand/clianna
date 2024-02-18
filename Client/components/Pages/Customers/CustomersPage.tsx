'use client';
import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import DhlDialog from '@components/Modals/DhlDialog';
import MessageDialog from '@components/Modals/MessageDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { EId } from '@customTypes/id';
import { Email, LocalShipping, Phone } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Customer } from '@utils/api/generated/Api';
import { getCustomerLabel, toCustomerUpsertRequest } from '@utils/customer';
import useApiClient from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import { useCustomerContext } from '../../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

export const CustomersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    activeColumns,
    messageTemplates,
  } = useCustomerContext();
  const ApiClient = useApiClient();

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [dhlCustomer, setDhlCustomer] = useState<Customer | null>(null);
  const [messageCustomer, setMessageCustomer] = useState<Customer | null>(null);

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
  const onCloseDeleteDialog = useCallback(() => setCustomerToDelete(null), []);
  const onCloseDHLDialog = useCallback(() => setDhlCustomer(null), []);
  const onCloseMessageDialog = useCallback(() => setMessageCustomer(null), []);

  const onConfirmDeleteDialog = useCallback(async () => {
    if (!customerToDelete?.id) return;
    const { error } = await ApiClient.customer.customerDelete(
      customerToDelete.id
    );
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
    ApiClient.customer,
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
      const { error, data } = await ApiClient.customer.customerCreate(
        toCustomerUpsertRequest(selected)
      );
      if (error || !data) {
        enqueueSnackbar('Erstellen von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newCustomers.unshift(data);
    } else {
      const { error, data } = await ApiClient.customer.customerUpdate(
        selected.id!,
        toCustomerUpsertRequest(selected)
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
    ApiClient.customer,
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
  const onDHLClick = useCallback((customer: Customer) => {
    setDhlCustomer(customer);
  }, []);
  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<Customer>
        header={<CustomersTableHeader />}
        rows={customers}
        columns={activeColumns}
        onRowClick={onRowClick}
        onDelete={setCustomerToDelete}
        customActions={[
          {
            tooltip: 'DHL-Pollingclient Download',
            icon: <LocalShipping />,
            onClick: onDHLClick,
          },
          {
            tooltip: 'E-Mail', //TODO: disable when no email is set
            icon: <Email />,
            onClick: (row) => setMessageCustomer(row),
          },
          {
            tooltip: 'Telefon', //TODO: disable when no phone is set
            icon: <Phone />,
            onClick: (row) =>
              (window.location.href = `tel:${row.mobile ?? row.phone}`),
          },
        ]}
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
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDeleteDialog}
      >
        <Typography mb={2}>
          Bist Du dir sicher, dass Du diesen Kunden löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getCustomerLabel(customerToDelete)}
        </Typography>
      </ConfirmDialog>
      <DhlDialog customer={dhlCustomer} onClose={onCloseDHLDialog} />
      <MessageDialog
        templates={messageTemplates}
        onClose={onCloseMessageDialog}
        reference={messageCustomer}
      />
    </Box>
  );
};

export default CustomersPage;
