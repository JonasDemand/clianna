import { IOrderWithDependencies } from '@customTypes/database/order';
import { IUpsertRequest } from '@customTypes/messages/order';

import { createClientFunction } from './helpers';

export class Order {
  public static Create = createClientFunction<
    IUpsertRequest,
    IOrderWithDependencies,
    string
  >('/api/order', 'POST');

  public static Update = (id: string, request: IUpsertRequest) =>
    createClientFunction<IUpsertRequest, IOrderWithDependencies, string>(
      `/api/order/${id}`,
      'PUT'
    )(request);

  public static Delete = (id: string) =>
    createClientFunction<void, void, string>(`/api/order/${id}`, 'DELETE')();
}
