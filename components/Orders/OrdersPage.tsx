import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Order } from '@prisma/client';
import { FC } from 'react';

type OrdersPageProps = {
  orders: Order[];
  customers: ICustomerWithOrders[];
};

const OrdersPage: FC<OrdersPageProps> = ({ orders, customers }) => {
  console.log({ orders, customers });
  return <>{JSON.stringify({ orders, customers })}</>;
};

export default OrdersPage;
