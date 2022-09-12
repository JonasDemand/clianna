import { IOrderWithCustomer } from '@customTypes/database/order';

export class Order {
  public static async Create(
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
  ): Promise<IOrderWithCustomer> {
    const res = await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to create order';
    }
    return (await res.json()) as IOrderWithCustomer;
  }

  public static async Update(
    id: string,
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>
  ): Promise<IOrderWithCustomer> {
    const res = await fetch(`/api/order/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to update order';
    }
    return (await res.json()) as IOrderWithCustomer;
  }

  public static async Delete(id: string): Promise<void> {
    const res = await fetch(`/api/order/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw 'Failed to delete order';
    }
  }
}
