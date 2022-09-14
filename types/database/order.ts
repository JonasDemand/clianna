import { EOrderShippingType, EOrderTax, Order } from '@prisma/client';

import { ICustomer } from './customer';
import { IDocument } from './document';

export interface IOrder extends Omit<Partial<Order>, 'userId' | 'customerId'> {
  taxes: EOrderTax | null;
  shippingType: EOrderShippingType | null;
}

export interface IOrderWithDependencies extends IOrder {
  customer: ICustomer | null;
  documents: IDocument[];
}
