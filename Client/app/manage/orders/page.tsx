import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
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
      PageSize: 500, //TODO: add pagination
    }),
    ApiClient.document.documentList({
      ColumnFilters: withColumnFilters([{ name: 'Template', value: 'true' }]),
      PageSize: 500, //TODO: add pagination
    }),
  ]);

  if (responses.some((res) => res.error || !res.data))
    throw new Error('Failed to fetch');

  const [orders, customers, templates] = responses.map((res) => res.data);

  return (
    <OrderProvider
      initialCustomers={customers as Customer[]}
      initialOrders={orders as Order[]}
      initialTemplates={templates as Document[]}
    >
      <OrdersPage />
    </OrderProvider>
  );
};

export default Orders;
