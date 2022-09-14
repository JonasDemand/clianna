import { Customer } from '@prisma/client';

import { IDocument } from './document';
import { IOrder } from './order';

export interface ICustomer extends Omit<Partial<Customer>, 'userId'> {}

export interface ICustomerWithDependencies extends ICustomer {
  orders: IOrder[];
  documents: IDocument[];
}
