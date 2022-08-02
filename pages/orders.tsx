import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import OrdersPage from '@components/Orders/OrdersPage';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Order } from '@prisma/client';
import { Db } from '@utils/database';
import { GetStaticProps, NextPage } from 'next';

type OrdersProps = {
  customers: ICustomerWithOrders[];
  orders: Order[];
};

const Orders: NextPage<OrdersProps> = ({ orders, customers }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <OrdersPage orders={orders} customers={customers} />
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getStaticProps: GetStaticProps<OrdersProps> = async () => ({
  props: {
    orders: await Db.Order.GetAll(),
    customers: await Db.Customer.GetAll(),
  },
});

export default Orders;
