import {
  ICredentailsRequest,
  IUpdateRequest,
  IValidationResponse,
} from '@customTypes/messages/user';

import { createClientFunction } from './helpers';

export class User {
  public static CreateCredentials = createClientFunction<
    ICredentailsRequest,
    void,
    string
  >('/api/user/credentials', 'POST');
  public static ValidateEmail = async (email: string) =>
    createClientFunction<void, IValidationResponse, string>(
      `/api/user/validate/email/${email}`,
      'GET'
    )();
  public static ValidateCredentials = async (password: string) =>
    createClientFunction<void, IValidationResponse, string>(
      `/api/user/validate/credentials/${password}`,
      'GET'
    )();

  public static Update = createClientFunction<IUpdateRequest, void, string>(
    '/api/user',
    'PUT'
  );
  public static Connect = createClientFunction<
    ICredentailsRequest,
    void,
    string
  >('/api/user/connect', 'POST');
}
