import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Orders = async () => {
  const ApiClient = await useApiClientServer();

  const { error, data } = await ApiClient.order.orderList({
    ColumnFilters: withColumnFilters([{ name: 'Pending', value: 'true' }]),
    ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
    PageSize: 100,
    PageNumber: 1,
  });

  if (error || !data?.list || !data.metaData)
    throw new Error('Failed to fetch');

  return (
    <PaginationProvider
      initialRowsCount={data.metaData.totalCount}
      initalSortModel={[
        {
          field: 'creationDate',
          sort: 'desc',
        },
      ]}
    >
      <OrderProvider initialOrders={data.list}>
        <OrdersPage />
      </OrderProvider>
    </PaginationProvider>
  );
};

export default Orders;
