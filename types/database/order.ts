import { Order } from '@prisma/client';

import { ICustomer } from './customer';

export interface IOrder extends Omit<Order, 'userId'> {}

export interface IOrderWithCustomer extends IOrder {
  customer: ICustomer | null;
}
