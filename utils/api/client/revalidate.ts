import { IRevalidateRequest } from '@customTypes/messages/revalidate';

import { createClientFunction } from './helpers';

export class Revalidate {
  public static Post = (
    secret: string,
    request: IRevalidateRequest,
    baseUrl?: string
  ) =>
    createClientFunction<IRevalidateRequest, string, string>(
      `/api/revalidate?secret=${secret}`,
      'POST'
    )(request, baseUrl);
}
