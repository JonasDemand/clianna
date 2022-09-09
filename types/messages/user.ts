import { User } from '@prisma/client';

export interface ICredentailsRequest {
  email: string;
  password: string;
}

export interface IValidationResponse {
  valid: boolean;
}

export interface IValidateCredentialsRequest {
  password: string;
}

export interface IUpdateUserRequest
  extends Omit<Partial<User>, 'id' | 'salt' | 'googleId' | 'refreshToken'> {}
