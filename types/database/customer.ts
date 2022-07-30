import { Customer, Order } from '@prisma/client';

export interface ICustomerWithOrders extends Customer {
  orders: Order[];
  openOrders: number;
}

export type ICustomerWithOrdersKeys = keyof ICustomerWithOrders;
