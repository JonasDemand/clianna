import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import { NextPage } from 'next';
import React from 'react';

const Orders: NextPage = () => {
  return (
    <OrderProvider
      initialCustomers={[]}
      initialOrders={[]}
      initialTemplates={[]}
    >
      <OrdersPage />
    </OrderProvider>
  );
};

export default Orders;
