import { Order } from '@prisma/client';

import { ICustomer } from './customer';
import { IDocument } from './document';

export interface IOrder extends Omit<Partial<Order>, 'userId' | 'customerId'> {}

export interface IOrderWithDependencies extends IOrder {
  customer: ICustomer | null;
  documents: IDocument[];
}
