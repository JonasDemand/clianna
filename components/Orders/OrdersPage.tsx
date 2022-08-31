import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { BackdropContext } from '@context/BackdropContext';
import { OrderContext } from '@context/OrderContext';
import { BackdropContextType } from '@customTypes/backdrop';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Box, Typography } from '@mui/material';
import { convertToOrder } from '@utils/api/orders';
import {
  createOrder,
  deleteOrder,
  updateOrder,
} from '@utils/api/requests/orders';
import { revalidate } from '@utils/api/requests/revalidate';
import { getCustomerLabel } from '@utils/customer';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useContext, useState } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
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

  const { enqueueSnackbar } = useSnackbar();

  const onClose = useCallback(() => setSelected(null), [setSelected]);
  const onSave = useCallback(async () => {
    if (!selected) return;
    setSelected(null);
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
        newOrder = await createOrder(convertToOrder(selected));
        newOrders.push(newOrder);
      } else {
        newOrder = await updateOrder(selected.id, convertToOrder(selected));
        const index = newOrders.findIndex((order) => order.id === newOrder.id);
        newOrders[index] = newOrder;
      }
      setOrders(newOrders);
      await revalidate(['/customers', '/orders']);
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
  const onCopy = useCallback(
    (order: IOrderWithCustomer) => setSelected({ ...order, id: -1 }),
    [setSelected]
  );
  const deleteSelectedOrder = useCallback(async () => {
    if (!orderToDelete) return;
    try {
      setOrderToDelete(null);
      setShowBackdrop(true);
      await deleteOrder(orderToDelete.id);
      setOrders(orders.filter((order) => order.id !== orderToDelete.id));
      await revalidate(['/customers', '/orders']);
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
        onCopy={onCopy}
        onDelete={setOrderToDelete}
      />
      <SideOverlay
        heading={'Auftragsbearbeitung'}
        open={!!selected}
        onClose={onClose}
        onSave={onSave}
      >
        <OrderFrom />
      </SideOverlay>
      <ConfirmDialog
        open={!!orderToDelete}
        title="Kunde löschen"
        onClose={() => setOrderToDelete(null)}
        onConfirm={() => deleteSelectedOrder()}
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
