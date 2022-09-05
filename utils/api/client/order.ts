import { IOrderWithCustomer } from '@customTypes/database/order';

export class Order {
  public async Create(
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
  ): Promise<IOrderWithCustomer> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to create order';
    }
    return (await res.json()) as IOrderWithCustomer;
  }

  public async Update(
    id: number,
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
  ): Promise<IOrderWithCustomer> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to update order';
    }
    return (await res.json()) as IOrderWithCustomer;
  }

  public async Delete(id: number): Promise<void> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw 'Failed to delete order';
    }
  }
}
