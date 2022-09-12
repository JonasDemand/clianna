import {
  ICredentailsRequest,
  IValidationResponse,
} from '@customTypes/messages/user';

import { createClientFunction } from './helpers';

export class User {
  public constructor() {}
  public async CreateCredentials(request: ICredentailsRequest) {
    const res = await fetch(`/api/user/credentials`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
  }
  public async ValidateEmail(email: string): Promise<IValidationResponse> {
    const res = await fetch(`/api/user/validate/email/${email}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
    return (await res.json()) as IValidationResponse;
  }
  public async ValidateCredentials(
    password: string
  ): Promise<IValidationResponse> {
    const res = await fetch(`/api/user/validate/credentials/${password}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
    return (await res.json()) as IValidationResponse;
  }
  public async Update(request: ICredentailsRequest) {
    const res = await fetch(`/api/user`, {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw { status: res.status, body: res.body };
    }
  }
  public Connect = createClientFunction<ICredentailsRequest, void, string>(
    '/api/user/connect',
    'POST'
  );
}
