import { IOrderWithCustomer } from '@customTypes/database/order';
import { Order } from '@prisma/client';

export const convertToOrder = (order: IOrderWithCustomer) => {
  const { id: _id, customer: _customer, ...newOrder } = order;
  return newOrder as Order;
};
