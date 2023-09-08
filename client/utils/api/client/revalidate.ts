import { IRevalidateRequest } from '@customTypes/messages/revalidate';

import { createClientFunction } from './helpers';

export class Revalidate {
  public static Post = createClientFunction<IRevalidateRequest, string, string>(
    '/api/revalidate',
    'POST'
  );
}
