import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import MuiTable from '@components/External/MuiTable';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useContext, useState } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    filteredOrders,
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
    searchText,
  } = useContext(OrderContext) as OrderContextType;

  const [orderToDelete, setOrderToDelete] =
    useState<IOrderWithDependencies | null>(null);

  const onCloseOverlay = useCallback(() => setSelected(null), [setSelected]);
  const onCloseDialog = useCallback(() => setOrderToDelete(null), []);

  const onSaveOverlay = useCallback(async () => {
    if (!selected) return;
    if (
      isEqual(
        selected,
        orders.find((order) => order.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }
    let create = !selected.id;
    let newOrders = [...orders];
    if (create) {
      const { error, response } = await ApiClient.Order.Create(selected);
      if (error || !response) {
        enqueueSnackbar('Erstellen von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newOrders.push(response);
    } else {
      const { error, response } = await ApiClient.Order.Update(
        selected.id!,
        selected
      );
      if (error || !response) {
        enqueueSnackbar('Aktualisieren von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newOrders.findIndex((order) => order.id === response!.id);
      newOrders[index] = response;
    }
    setOrders(newOrders);
    setSelected(null);
    enqueueSnackbar(
      `Erfolgreich Auftrag ${create ? 'erstellt' : 'aktualisiert'}`,
      { variant: 'success' }
    );
  }, [enqueueSnackbar, orders, selected, setOrders, setSelected]);

  const onCopyRow = useCallback(
    (order: IOrderWithDependencies) => setSelected({ ...order, id: undefined }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!orderToDelete?.id) return;
    const { error } = await ApiClient.Order.Delete(orderToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Auftrag fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Auftrag gelöscht', { variant: 'success' });
    setOrders(orders.filter((order) => order.id !== orderToDelete.id));
  }, [enqueueSnackbar, orderToDelete, orders, setOrders]);

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<IOrderWithDependencies>
        header={<OrdersTableHeader />}
        rows={filteredOrders}
        columns={activeColumns}
        onEdit={setSelected}
        onCopy={onCopyRow}
        onDelete={setOrderToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Auftrag bearbeiten"
        open={!!selected}
        onClose={onCloseOverlay}
        onSave={onSaveOverlay}
      >
        <OrderFrom />
      </SideOverlay>
      <ConfirmDialog
        open={!!orderToDelete}
        title="Kunde löschen"
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du diesen Auftrag löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          Auftrag {orderToDelete?.id}
          {orderToDelete?.customer && (
            <>
              <br />
              Für Kunde {getCustomerLabel(orderToDelete?.customer)}
            </>
          )}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default OrdersPage;
