import { IOrderWithCustomer } from '@customTypes/database/order';
import { Order } from '@prisma/client';

export const updateOrder = async (
  id: number,
  order: Omit<Order, 'id'>
): Promise<IOrderWithCustomer> => {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    throw 'Failed to update order';
  }
  return (await res.json()) as IOrderWithCustomer;
};

export const createOrder = async (
  order: Omit<Order, 'id'>
): Promise<IOrderWithCustomer> => {
  const res = await fetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    throw 'Failed to create order';
  }
  return (await res.json()) as IOrderWithCustomer;
};

export const revalidate = async (): Promise<void> => {
  const res = await fetch('/api/orders/revalidate', {
    method: 'POST',
  });
  if (!res.ok) {
    throw 'Failed to revalidate';
  }
};
