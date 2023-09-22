import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Orders = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.customer.customerList(),
    ApiClient.order.orderList(),
    ApiClient.document.documentList(),
  ]);

  if (responses.some((res) => res.error || !res.data))
    throw new Error('Failed to fetch');

  const [customers, orders, templates] = responses.map((res) => res.data);

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
