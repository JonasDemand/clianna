import SideOverlay from '@components/SideOverlay/SideOverlay';
import TablePage from '@components/Table/TablePage';
import { OrderContext } from '@context/OrderContext';
import { OrderContextType } from '@customTypes/order';
import { Box } from '@mui/material';
import { Order } from '@prisma/client';
import { FC, useContext } from 'react';

import OrdersTableHeader from './OrdersTableHeader';

const OrdersPage: FC = () => {
  const { filteredOrders, activeColumns } = useContext(
    OrderContext
  ) as OrderContextType;

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <TablePage<Order>
        header={<OrdersTableHeader />}
        rows={filteredOrders}
        columns={activeColumns}
      />
      <SideOverlay open={false} onClose={() => {}} onSave={() => {}}>
        Hello World
      </SideOverlay>
    </Box>
  );
};

export default OrdersPage;
