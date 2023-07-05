import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import DocumentProvider from '@context/DocumentContext';
import { ICustomer } from '@customTypes/database/customer';
import { IDocumentWithDependencies } from '@customTypes/database/document';
import { IOrder } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
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

export const getServerSideProps: GetServerSideProps<OrdersProps> = async (
  context
) => {
  const session = await getSession(context);
  if (!session) return { props: { documents: [], customers: [], orders: [] } };
  return {
    props: {
      documents: await DbRepo.Document.GetAll(true),
      orders: await DbRepo.Order.GetAll(false),
      customers: await DbRepo.Customer.GetActive(false),
    },
  };
};

export default Documents;
