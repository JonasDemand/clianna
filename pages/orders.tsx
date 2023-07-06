import OrdersPage from '@components/Pages/Orders/OrdersPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import OrderProvider from '@context/OrderContext';
import { ICustomer } from '@customTypes/database/customer';
import { IDocument } from '@customTypes/database/document';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

type OrdersProps = {
  customers: ICustomer[];
  templates: IDocument[];
  orders: IOrderWithDependencies[];
};

const Orders: NextPage<OrdersProps> = ({ orders, customers, templates }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <OrderProvider
          initialCustomers={customers}
          initialOrders={orders}
          initialTemplates={templates}
        >
          <OrdersPage />
        </OrderProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<OrdersProps> = async () => {
  return {
    props: {
      orders: await DbRepo.Order.GetAll(true),
      customers: await DbRepo.Customer.GetActive(false),
      templates: await DbRepo.Document.GetTemplates(false),
    },
  };
};

export default Orders;
