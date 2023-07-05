import { IUpdateRequest } from '@customTypes/messages/user';

import { createClientFunction } from './helpers';

export class User {
  public static Update = createClientFunction<IUpdateRequest, void, string>(
    '/api/user',
    'PUT'
  );
}
