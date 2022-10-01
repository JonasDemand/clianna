import { Order } from '@prisma/client';

import { ICustomerWithDependencies } from './customer';
import { IDocumentWithDependencies } from './document';

export interface IOrder extends Omit<Partial<Order>, 'userId' | 'customerId'> {}

export interface IOrderWithDependencies extends IOrder {
  customer?: Omit<ICustomerWithDependencies, 'orders'> | null;
  documents?: Omit<IDocumentWithDependencies, 'document'>[];
}
