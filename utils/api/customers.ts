import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Customer } from '@prisma/client';

export const concertToCustomer = (customer: ICustomerWithOrders) => {
  const {
    id: _id,
    orders: _orders,
    openOrders: _openOrders,
    ...newCust
  } = customer;
  return newCust as Customer;
};
