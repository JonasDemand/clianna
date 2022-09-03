import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import OrdersPage from '@components/Orders/OrdersPage';
import OrderProvider from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { Customer } from '@prisma/client';
import { Db } from '@utils/database';
import { GetServerSideProps, NextPage } from 'next';

type OrdersProps = {
  customers: Customer[];
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

export const getServerSideProps: GetServerSideProps<
  OrdersProps
> = async () => ({
  props: {
    orders: await Db.Order.GetAll(true),
    customers: await Db.Customer.GetActive(false),
  },
});

export default Orders;
