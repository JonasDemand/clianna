import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import { ICustomer } from '@customTypes/database/customer';
import { IDocumentWithDependencies } from '@customTypes/database/document';
import { IOrder } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

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
  DbRepo.Init(session.user.id ?? '');
  return {
    props: {
      documents: await DbRepo.Instance.Document.GetAll(true),
      orders: await DbRepo.Instance.Order.GetAll(false),
      customers: await DbRepo.Instance.Customer.GetActive(false),
    },
  };
};

export default Documents;
