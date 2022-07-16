import { Customer } from '@prisma/client';

import { ICustomerWithOrders } from '../../@types/database/customer';

export const concertToCustomer = (customer: ICustomerWithOrders) => {
  const {
    id: _id,
    orders: _orders,
    openOrders: _openOrders,
    ...newCust
  } = customer;
  return newCust as Customer;
};
