import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Box } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import { convertToOrder } from '@utils/api/orders';
import {
  createOrder,
  revalidate,
  updateOrder,
} from '@utils/api/requests/orders';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useContext } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const {
    filteredOrders,
    activeColumns,
    selected,
    setSelected,
    orders,
    setOrders,
  } = useContext(OrderContext) as OrderContextType;

  const { enqueueSnackbar } = useSnackbar();

  const onClose = useCallback(() => setSelected(null), [setSelected]);
  const onSave = useCallback(async () => {
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
        newOrder = await createOrder(convertToOrder(selected));
        newOrders.push(newOrder);
      } else {
        newOrder = await updateOrder(selected.id, convertToOrder(selected));
        const index = newOrders.findIndex((order) => order.id === newOrder.id);
        newOrders[index] = newOrder;
      }
      setSelected(null);
      setOrders(newOrders);
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
      return;
    }

    revalidate();
  }, [enqueueSnackbar, orders, selected, setOrders, setSelected]);
  const onSelectionModelChange = useCallback(
    (model: GridSelectionModel) => {
      if (selected?.id === -1 && !model[0]) return;
      setSelected(
        filteredOrders.find(
          (order) => order.id === model[0]
        ) as IOrderWithCustomer
      );
    },
    [filteredOrders, selected?.id, setSelected]
  );

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
        selectionModel={selected ? [selected.id] : []}
        onSelectionModelChange={onSelectionModelChange}
      />
      <SideOverlay
        heading={'Auftragsbearbeitung'}
        open={!!selected}
        onClose={onClose}
        onSave={onSave}
      >
        <OrderFrom />
      </SideOverlay>
    </Box>
  );
};

export default OrdersPage;
