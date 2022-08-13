import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Box } from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import { FC, useCallback, useContext } from 'react';

import OrderFrom from './Form';
import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const { filteredOrders, activeColumns, selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  const onClose = useCallback(() => setSelected(null), [setSelected]);
  const onSave = useCallback(async () => {
    alert('SAVE!!!!');
  }, []);
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
