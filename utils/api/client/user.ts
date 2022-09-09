import {
  ICreateCredentialsRequest,
  IValidateUserResponse,
} from '@customTypes/messages/user';

export class User {
  public async UpsertCredentials(request: ICreateCredentialsRequest) {
    const res = await fetch(`/api/user/credentials`, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: { 'content-type': 'application/json' },
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
  }
  public async Validate(email: string): Promise<IValidateUserResponse> {
    const res = await fetch(`/api/user/validate?email=${email}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw 'Failed to validate email';
    }
    return (await res.json()) as IValidateUserResponse;
  }
}
