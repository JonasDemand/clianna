'use client';

import MuiTable from '@components/External/MuiTable';
import MuiTextField from '@components/External/MuiTextField';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { EId } from '@customTypes/id';
import { LocalShipping } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { Customer } from '@utils/api/generated/Api';
import {
  generateDHLPollingClientCSV,
  getCustomerLabel,
  toCustomerUpsertRequest,
} from '@utils/customer';
import { formatDate } from '@utils/date';
import useApiClient from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';
import { TextEncoder } from 'text-encoding';

import { useCustomerContext } from '../../../context/CustomerContext';
import CustomersTableHeader from './CustomersTableHeader';
import CustomerForm from './Form';

const CustomersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { customers, setCustomers, selected, setSelected, activeColumns } =
    useCustomerContext();
  const ApiClient = useApiClient();

  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [dhlCustomer, setDhlCustomer] = useState<Customer | null>(null);
  const [dhlWeight, setDhlWeight] = useState<number>(1);

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
  const onConfirmDHLDialog = useCallback(() => {
    const dhlFile = generateDHLPollingClientCSV(dhlCustomer!, dhlWeight);
    // Convert the content to Uint8Array with ANSI encoding
    const encoder = new TextEncoder('windows-1252', {
      NONSTANDARD_allowLegacyEncoding: true,
    });

    const encodedData = encoder.encode(dhlFile);

    // Create a Blob with the encoded data
    const blob = new Blob([encodedData], {
      type: 'text/csv;charset=windows-1252',
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${dhlCustomer!.id}-${formatDate(new Date())}.csv`
    );

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setDhlCustomer(null);
    setDhlWeight(1);
  }, [dhlCustomer, dhlWeight]);

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
      <ConfirmDialog
        open={!!dhlCustomer}
        title="DHL-Pollingclient Download"
        onClose={onCloseDHLDialog}
        onConfirm={onConfirmDHLDialog}
        abortLabel="Abbrechen"
        confirmLabel="Download"
      >
        <Typography>Paket für Kunde</Typography>
        <Typography fontWeight="bold" mb={2}>
          {getCustomerLabel(dhlCustomer)}
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={6}>
            <MuiTextField
              required
              label="Gewicht"
              type="number"
              inputProps={{
                step: '.5',
              }}
              value={dhlWeight.toFixed(1)}
              onChange={(e) => setDhlWeight(parseFloat(e.target.value))}
            />
          </Grid>
        </Grid>
      </ConfirmDialog>
    </Box>
  );
};

export default CustomersPage;
