import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import OrdersPage from '@components/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import { ICustomer } from '@customTypes/database/customer';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

type OrdersProps = {
  customers: ICustomer[];
  orders: IOrderWithCustomer[];
};

const Orders: NextPage<OrdersProps> = ({ orders, customers }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <OrderProvider initialCustomers={customers} initialOrders={orders}>
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
  if (!session) return { props: { customers: [], orders: [] } };
  DbRepo.Init(session.user.cuid);
  return {
    props: {
      orders: await DbRepo.Instance.Order.GetAll(true),
      customers: await DbRepo.Instance.Customer.GetActive(false),
    },
  };
};

export default Orders;
