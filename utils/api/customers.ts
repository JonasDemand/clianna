import { ICustomer, ICustomerWithOrders } from '@customTypes/database/customer';

export const convertToICustomer = (customer: ICustomerWithOrders) => {
  const { id: _id, orders: _orders, ...newCust } = customer;
  return newCust as ICustomer;
};
