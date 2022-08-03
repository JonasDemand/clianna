import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Customer } from '@prisma/client';

export const concertToCustomer = (customer: ICustomerWithOrders) => {
  const { id: _id, orders: _orders, ...newCust } = customer;
  return newCust as Customer;
};
