import { IOrderWithDependencies } from '@customTypes/database/order';
import { IUpsertRequest } from '@customTypes/messages/order';

import { createClientFunction } from './helpers';

export class Order {
  public static Create = createClientFunction<
    IUpsertRequest,
    IOrderWithDependencies,
    string
  >('/api/order', 'POST');

  public static Update = (
    id: string,
    request: IUpsertRequest,
    baseUrl?: string
  ) =>
    createClientFunction<IUpsertRequest, IOrderWithDependencies, string>(
      `/api/order/${id}`,
      'PUT'
    )(request, baseUrl);

  public static Delete = (id: string, baseUrl?: string) =>
    createClientFunction<void, void, string>(`/api/order/${id}`, 'DELETE')(
      undefined,
      baseUrl
    );
}
