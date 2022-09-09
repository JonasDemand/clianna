import { User } from '@prisma/client';

export interface ICreateCredentialsRequest {
  email: string;
  password: string;
}

export interface IValidateUserResponse {
  valid: boolean;
}

export interface IUpdateUserRequest
  extends Omit<Partial<User>, 'id' | 'salt' | 'googleId' | 'refreshToken'> {}
