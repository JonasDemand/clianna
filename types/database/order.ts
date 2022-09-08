import { EOrderShippingType, EOrderTax, Order } from '@prisma/client';

import { ICustomer } from './customer';

export interface IOrder extends Omit<Partial<Order>, 'userId' | 'customerId'> {
  taxes: EOrderTax | null;
  shippingType: EOrderShippingType | null;
}

export interface IOrderWithCustomer extends IOrder {
  customer: ICustomer | null;
}
