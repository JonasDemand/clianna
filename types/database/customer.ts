import { Customer } from '@prisma/client';

import { IDocumentWithDependencies } from './document';
import { IOrderWithDependencies } from './order';

export interface ICustomer extends Omit<Partial<Customer>, 'userId'> {}

export interface ICustomerWithDependencies extends ICustomer {
  orders?: Omit<IOrderWithDependencies, 'customer'>[];
  documents?: Omit<IDocumentWithDependencies, 'customer'>[];
}
