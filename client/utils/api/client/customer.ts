import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { IUpsertRequest } from '@customTypes/messages/customer';

import { createClientFunction } from './helpers';

export class Customer {
  public static Create = createClientFunction<
    IUpsertRequest,
    ICustomerWithDependencies,
    string
  >('/api/customer', 'POST');

  public static Update = (
    id: string,
    request: IUpsertRequest,
    baseUrl?: string
  ) =>
    createClientFunction<IUpsertRequest, ICustomerWithDependencies, string>(
      `/api/customer/${id}`,
      'PUT'
    )(request, baseUrl);

  public static Delete = (id: string) =>
    createClientFunction<void, void, string>(`/api/customer/${id}`, 'DELETE')();
}
