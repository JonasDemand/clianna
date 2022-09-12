import { ICustomerWithOrders } from '@customTypes/database/customer';
import { IUpsertRequest } from '@customTypes/messages/customer';

import { createClientFunction } from './helpers';

export class Customer {
  public static Create = createClientFunction<
    IUpsertRequest,
    ICustomerWithOrders,
    string
  >('/api/customer', 'POST');

  public static Update = (id: string, request: IUpsertRequest) =>
    createClientFunction<IUpsertRequest, ICustomerWithOrders, string>(
      `/api/customer/${id}`,
      'PUT'
    )(request);

  public static Delete = (id: string) =>
    createClientFunction<void, void, string>(`/api/customer/${id}`, 'DELETE')();
}
