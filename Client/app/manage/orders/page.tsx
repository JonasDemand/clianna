import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Orders = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.order.orderList({
      ColumnFilters: withColumnFilters([{ name: 'Pending', value: 'true' }]),
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 100,
      PageNumber: 1,
    }),
    ApiClient.customer.customerList({
      ColumnFilters: withColumnFilters([{ name: 'Disabled', value: 'false' }]),
      ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
      PageSize: 1000, //TODO: add pagination
    }),
    ApiClient.document.documentList({
      ColumnFilters: withColumnFilters([{ name: 'Template', value: 'true' }]),
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 1000, //TODO: add pagination
    }),
  ]);

  if (
    responses.some((res) => res.error || !res.data?.list || !res.data.metaData)
  )
    throw new Error('Failed to fetch');

  const [orders, customers, templates] = responses.map((res) => res.data!);

  return (
    <PaginationProvider
      initialRowsCount={orders.metaData!.totalCount!}
      initalSortModel={[
        {
          field: 'creationDate',
          sort: 'desc',
        },
      ]}
    >
      <OrderProvider
        initialCustomers={customers.list as Customer[]}
        initialOrders={orders.list as Order[]}
        initialTemplates={templates.list as Document[]}
      >
        <OrdersPage />
      </OrderProvider>
    </PaginationProvider>
  );
};

export default Orders;
