import { Document } from '@prisma/client';

import { ICustomer } from './customer';
import { IOrder } from './order';

export interface IDocument
  extends Omit<Partial<Document>, 'customerId' | 'orderId' | 'userId'> {}

export interface IDocumentWithDependencies extends IDocument {
  customer?: ICustomer | null;
  order?: IOrder | null;
}
