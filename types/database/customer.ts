import { Customer } from '@prisma/client';

import { IOrder } from './order';

export interface ICustomer extends Omit<Customer, 'userId'> {}

export interface ICustomerWithOrders extends ICustomer {
  orders: IOrder[];
}
