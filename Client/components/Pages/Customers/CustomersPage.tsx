import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/ApiClient';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useContext, useState } from 'react';

import { CustomerContext } from '../../../context/CustomerContext';
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
  } = useContext(CustomerContext) as CustomerContextType;

  const [customerToDelete, setCustomerToDelete] =
    useState<ICustomerWithDependencies | null>(null);

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
    const { error } = await ApiClient.Customer.Delete(customerToDelete.id);
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
  }, [customerToDelete, customers, enqueueSnackbar, setCustomers]);

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
      const { error, response } = await ApiClient.Customer.Create(selected);
      if (error || !response) {
        enqueueSnackbar('Erstellen von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newCustomers.push(response);
    } else {
      const { error, response } = await ApiClient.Customer.Update(
        selected.id!,
        selected
      );
      if (error || !response) {
        enqueueSnackbar('Aktualisieren von Kunde fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newCustomers.findIndex(
        (customer) => customer.id === response!.id
      );
      newCustomers[index] = response;
    }
    setCustomers(newCustomers);
    setSelected(null);
    enqueueSnackbar('Erfolgreich Kunde erstellt', { variant: 'success' });
  }, [customers, enqueueSnackbar, selected, setCustomers, setSelected]);

  const onRowClick = useCallback(
    ({ row }: { row: ICustomerWithDependencies }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<ICustomerWithDependencies>
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
