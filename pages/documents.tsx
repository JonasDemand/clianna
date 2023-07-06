import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import DocumentProvider from '@context/DocumentContext';
import { ICustomer } from '@customTypes/database/customer';
import { IDocumentWithDependencies } from '@customTypes/database/document';
import { IOrder } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';

type OrdersProps = {
  documents: IDocumentWithDependencies[];
  customers: ICustomer[];
  orders: IOrder[];
};

const Documents: NextPage<OrdersProps> = ({ documents, orders, customers }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <DocumentProvider
          initialCustomers={customers}
          initialOrders={orders}
          initialDocuments={documents}
        >
          <DocumentsPage />
        </DocumentProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getStaticProps: GetStaticProps<OrdersProps> = async () => {
  return {
    props: {
      documents: await DbRepo.Document.GetAll(true),
      orders: await DbRepo.Order.GetAll(false),
      customers: await DbRepo.Customer.GetActive(false),
    },
    revalidate: 60,
  };
};

export default Documents;
