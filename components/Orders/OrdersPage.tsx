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
    let create = selected.id === -1;
    let newOrders = [...orders];
    let newOrder = selected;
    try {
      if (create) {
        newOrder = await ApiClient.Instance.Order.Create(selected);
        newOrders.push(newOrder);
      } else {
        newOrder = await ApiClient.Instance.Order.Update(selected.id, selected);
        const index = newOrders.findIndex((order) => order.id === newOrder.id);
        newOrders[index] = newOrder;
      }
      setOrders(newOrders);
      setSelected(null);
      enqueueSnackbar(
        `Erfolgreich Auftrag ${create ? 'erstellt' : 'aktualisiert'}`,
        { variant: 'success' }
      );
    } catch {
      enqueueSnackbar(
        `${create ? 'Erstellen' : 'Aktualisieren'} von Auftrag
          fehlgeschlagen`,
        { variant: 'error' }
      );
    }
  }, [enqueueSnackbar, orders, selected, setOrders, setSelected]);

  const onCopyRow = useCallback(
    (order: IOrderWithCustomer) => setSelected({ ...order, id: -1 }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!orderToDelete) return;
    try {
      setOrderToDelete(null);
      setShowBackdrop(true);
      await ApiClient.Instance.Order.Delete(orderToDelete.id);
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      enqueueSnackbar('Erfolgreich Auftrag gelöscht', { variant: 'success' });
    } catch {
      enqueueSnackbar('Löschen von Auftrag fehlgeschlagen', {
        variant: 'error',
      });
    } finally {
      setShowBackdrop(false);
    }
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
