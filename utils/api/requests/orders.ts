import { IOrderWithCustomer } from '@customTypes/database/order';

export const updateOrder = async (
  id: number,
  order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
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
  order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
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

export const deleteOrder = async (id: number): Promise<void> => {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw 'Failed to delete order';
  }
};
