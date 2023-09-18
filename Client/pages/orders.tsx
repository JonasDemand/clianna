import OrdersPage from '@components/Pages/Orders/OrdersPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import OrderProvider from '@context/OrderContext';
import { NextPage } from 'next';
import React from 'react';

const Orders: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <OrderProvider
          initialCustomers={[]}
          initialOrders={[]}
          initialTemplates={[]}
        >
          <OrdersPage />
        </OrderProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Orders;
