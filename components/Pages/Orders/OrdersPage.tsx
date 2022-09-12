import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { BackdropContext } from '@context/BackdropContext';
import { OrderContext } from '@context/OrderContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { IOrderWithCustomer } from '@customTypes/database/order';
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
  const { setShowBackdrop } = useContext(
    BackdropContext
  ) as BackdropContextType;
  const {
    filteredOrders,
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
    searchText,
  } = useContext(OrderContext) as OrderContextType;

  const [orderToDelete, setOrderToDelete] = useState<IOrderWithCustomer | null>(
    null
  );

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
      const createResponse = await ApiClient.Order.Create(selected);
      if (createResponse.error || !createResponse.response) {
        enqueueSnackbar('Erstellen von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      newOrders.push(createResponse.response);
    } else {
      const updateResponse = await ApiClient.Order.Update(
        selected.id!,
        selected
      );
      if (updateResponse.error || !updateResponse.response) {
        enqueueSnackbar('Aktualisieren von Auftrag fehlgeschlagen', {
          variant: 'error',
        });
        return;
      }
      const index = newOrders.findIndex(
        (order) => order.id === updateResponse.response!.id
      );
      newOrders[index] = updateResponse.response;
    }
    setOrders(newOrders);
    setSelected(null);
    enqueueSnackbar(
      `Erfolgreich Auftrag ${create ? 'erstellt' : 'aktualisiert'}`,
      { variant: 'success' }
    );
  }, [enqueueSnackbar, orders, selected, setOrders, setSelected]);

  const onCopyRow = useCallback(
    (order: IOrderWithCustomer) => setSelected({ ...order, id: undefined }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!orderToDelete?.id) return;
    setOrderToDelete(null);
    setShowBackdrop(true);
    const deleteReponse = await ApiClient.Order.Delete(orderToDelete.id);
    setShowBackdrop(false);
    if (deleteReponse.error) {
      enqueueSnackbar('Löschen von Auftrag fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Auftrag gelöscht', { variant: 'success' });
    setOrders(orders.filter((order) => order.id !== orderToDelete.id));
  }, [enqueueSnackbar, orderToDelete, orders, setOrders, setShowBackdrop]);

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <TablePage<IOrderWithCustomer>
        header={<OrdersTableHeader />}
        rows={filteredOrders}
        columns={activeColumns}
        onEdit={setSelected}
        onCopy={onCopyRow}
        onDelete={setOrderToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading={'Auftragsbearbeitung'}
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
          <br />
          Für Kunde {getCustomerLabel(orderToDelete?.customer)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default OrdersPage;
