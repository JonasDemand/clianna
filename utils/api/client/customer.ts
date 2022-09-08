import { ICustomer, ICustomerWithOrders } from '@customTypes/database/customer';

export class Customer {
  public async Create(
    customer: Omit<ICustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    const res = await fetch('/api/customer', {
      method: 'POST',
      body: JSON.stringify(customer),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to create customer';
    }
    return (await res.json()) as ICustomerWithOrders;
  }

  public async Update(
    id: string,
    customer: Omit<ICustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    const res = await fetch(`/api/customer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to update customer';
    }
    return (await res.json()) as ICustomerWithOrders;
  }

  public async Delete(id: string): Promise<void> {
    const res = await fetch(`/api/customer/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw 'Failed to delete customer';
    }
  }
}
