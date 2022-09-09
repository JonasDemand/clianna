import {
  ICredentailsRequest,
  IUpdateUserRequest,
  IValidationResponse,
} from '@customTypes/messages/user';

export class User {
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
  public async Update(request: IUpdateUserRequest) {
    const res = await fetch(`/api/user`, {
      method: 'PUT',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
  }
}
