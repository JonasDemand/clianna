import { Customer } from '@prisma/client';
import { ICustomerWithOrders } from '../../../@types/customer';

export const updateCustomer = async (
  customer: ICustomerWithOrders
): Promise<ICustomerWithOrders> => {
  const res = await fetch(`/api/customers/${customer.id}`, {
    method: 'PUT',
    body: JSON.stringify(customer),
  });
  if (!res.ok) {
    throw 'Failed to update customer';
  }
  return (await res.json()) as ICustomerWithOrders;
};

export const createCustomer = async (
  customer: ICustomerWithOrders
): Promise<ICustomerWithOrders> => {
  const res = await fetch(`/api/customers`, {
    method: 'POST',
    body: JSON.stringify(customer),
  });
  if (!res.ok) {
    throw 'Failed to create customer';
  }
  return (await res.json()) as ICustomerWithOrders;
};
