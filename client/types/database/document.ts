import { Document } from '@prisma/client';

import { ICustomerWithDependencies } from './customer';
import { IOrderWithDependencies } from './order';

export interface IDocument
  extends Omit<Partial<Document>, 'customerId' | 'orderId' | 'userId'> {}

export interface IDocumentWithDependencies extends IDocument {
  customer?: Omit<ICustomerWithDependencies, 'documents'> | null;
  order?: Omit<IOrderWithDependencies, 'documents'> | null;
}
