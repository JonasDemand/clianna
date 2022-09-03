import { IOrder, IOrderWithCustomer } from '@customTypes/database/order';

export const convertToIOrder = (order: IOrderWithCustomer) => {
  const { id: _id, customer: _customer, ...newOrder } = order;
  return newOrder as IOrder;
};
