import { Customer } from '@prisma/client';

import { ICustomerWithOrders } from '../../../@types/database/customer';

export const updateCustomer = async (
  id: number,
  customer: Omit<Customer, 'id'>
): Promise<ICustomerWithOrders> => {
  const res = await fetch(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    throw 'Failed to update customer';
  }
  return (await res.json()) as ICustomerWithOrders;
};

export const createCustomer = async (
  customer: Omit<Customer, 'id'>
): Promise<ICustomerWithOrders> => {
  const res = await fetch('/api/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
    headers: { 'content-type': 'application/json' },
  });
  if (!res.ok) {
    throw 'Failed to create customer';
  }
  return (await res.json()) as ICustomerWithOrders;
};

export const revalidate = async (): Promise<void> => {
  const res = await fetch('/api/customers/revalidate', {
    method: 'POST',
  });
  if (!res.ok) {
    throw 'Failed to revalidate';
  }
};
