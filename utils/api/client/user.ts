import { IValidateUserResponse } from '@customTypes/database/user';

export class User {
  public async Create() {
    throw 'Not implemented';
  }
  public async Validate(email: string): Promise<IValidateUserResponse> {
    const res = await fetch(`/api/users/validate/?email=${email}`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw 'Failed to delete order';
    }
    return (await res.json()) as IValidateUserResponse;
  }
}
