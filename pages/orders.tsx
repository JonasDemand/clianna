import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import OrdersPage from '@components/Pages/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import { ICustomer } from '@customTypes/database/customer';
import { IDocument } from '@customTypes/database/document';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

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

export const getServerSideProps: GetServerSideProps<OrdersProps> = async (
  context
) => {
  const session = await getSession(context);
  if (!session) return { props: { customers: [], orders: [], templates: [] } };
  DbRepo.Init(session.user.id ?? '');
  return {
    props: {
      orders: await DbRepo.Instance.Order.GetAll(true),
      customers: await DbRepo.Instance.Customer.GetActive(false),
      templates: await DbRepo.Instance.Document.GetTemplates(false),
    },
  };
};

export default Orders;
